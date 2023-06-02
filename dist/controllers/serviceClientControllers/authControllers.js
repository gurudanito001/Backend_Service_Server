"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeUserPassword = exports.resetUserPassword = exports.resendVerificationLink = exports.confirmUserEmail = exports.authenticateUser = exports.registerUser = void 0;
const sendEmail_1 = __importDefault(require("../../services/sendEmail"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../../config"));
const users_1 = __importDefault(require("../../dbServices/users"));
const clusters_1 = __importDefault(require("../../dbServices/clusters"));
const validator_1 = __importDefault(require("validator"));
const doesDataMatchStructure_1 = require("../../services/doesDataMatchStructure");
const registerUser = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const data = request.body;
    const { apiKey } = request.params; //apikey will be derived from the appToken in the future
    if (!apiKey) {
        return response.status(400).send({ message: "apiKey is required" });
    }
    let keys = Object.keys(data);
    if (!keys.includes("email") || !keys.includes("password")) {
        return response.status(400).send({ message: "Email and Password fields are required" });
    }
    if (!validator_1.default.isEmail(data.email)) {
        return response.status(400).send({ message: "Email is not valid" });
    }
    if (validator_1.default.isEmpty(data === null || data === void 0 ? void 0 : data.password)) {
        return response.status(400).send({ message: "Password is required" });
    }
    try {
        let emailExists = yield clusters_1.default.JsonbDataExists("users", "email", data.email);
        if (emailExists) {
            return response.status(400).send({ message: "Email already Exists" });
        }
        let structure = yield users_1.default.getStructureByClusterId(apiKey);
        if (structure) {
            let isCorrectStructure = (0, doesDataMatchStructure_1.doesDataMatchStructure)(data, structure.structure);
            if (!isCorrectStructure) {
                return response.status(400).send({ message: "Data shape does not match User Structure" });
            }
        }
        else {
            structure = (yield users_1.default.createUserDataStructure(apiKey, data));
        }
        let hashedPassword = yield bcrypt_1.default.hash(data.password, 7);
        let newData = Object.assign(Object.assign({}, data), { password: hashedPassword });
        let user = yield users_1.default.createUser({ cluster_id: apiKey, data: newData });
        let { verify_email_url } = yield clusters_1.default.getClusterById(apiKey);
        if (user) {
            if (data.test_string === config_1.default.TEST_STRING.toString()) {
                return response.status(201).json({
                    message: ['User Created Successfully'],
                    status: "success",
                    statusCode: 201,
                    payload: { user, structure }
                });
            }
            let unSignedData = { email: data.email, user_id: user.user_id };
            const token = jsonwebtoken_1.default.sign(unSignedData, config_1.default.SECRET, {
                expiresIn: "900000" //15mins
            });
            (0, sendEmail_1.default)({ email: data.email, url: `${verify_email_url}?token=${token}` })
                .then(res => {
                return response.status(201).json({
                    message: ['A verification link has been sent to your email. Link expires in 15mins'],
                    status: "success",
                    statusCode: 200,
                    payload: null
                });
            });
        }
    }
    catch (error) {
        return response.status(400).json({ message: error.message });
    }
});
exports.registerUser = registerUser;
const authenticateUser = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = request.body;
    try {
        const user = yield users_1.default.getUserByJsonbData('email', email);
        if (!user) {
            return response.status(404).json({ message: "Invalid Email or Password" });
        }
        const isValidPassword = yield bcrypt_1.default.compare(password, user.data.password);
        if (!isValidPassword) {
            return response.status(404).json({ message: "Invalid Email or Password" });
        }
        if (!user.email_confirmed) {
            return response.status(400).json({ message: "Email not verified" });
        }
        return response.status(201).json({
            message: [`Login Successful`],
            status: "success",
            statusCode: 200,
            payload: user
        });
    }
    catch (error) {
        return response.status(400).send({ message: error.message });
    }
});
exports.authenticateUser = authenticateUser;
const confirmUserEmail = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = request.params;
    try {
        let { user_id, email } = jsonwebtoken_1.default.verify(token, config_1.default.SECRET);
        let userExists = yield users_1.default.userExists(user_id);
        if (!userExists) {
            return response.status(404).json({ message: "User does not exist" });
        }
        let user = yield users_1.default.verifyEmail(user_id);
        if (user) {
            return response.status(200).json({
                message: ["Email verified Successfully"],
                status: "success",
                statusCode: 200,
                payload: null
            });
        }
    }
    catch (error) {
        return response.status(400).send({ message: error.message });
    }
});
exports.confirmUserEmail = confirmUserEmail;
const resendVerificationLink = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    let { email, apiKey } = request.params;
    if (!validator_1.default.isEmail(email)) {
        return response.status(400).send({ message: "Email is not valid" });
    }
    try {
        let user = yield users_1.default.getUserByJsonbData('email', email);
        if (!user) {
            return response.status(404).send({ message: "User does not exist" });
        }
        if (user.email_confirmed) {
            return response.status(400).send({ message: "User email already verified" });
        }
        let unSignedData = { email: email, user_id: user.user_id };
        const token = jsonwebtoken_1.default.sign(unSignedData, config_1.default.SECRET, {
            expiresIn: "900000" //15mins
        });
        const { verify_email_url } = yield clusters_1.default.getClusterById(apiKey);
        (0, sendEmail_1.default)({ email, url: `${verify_email_url}?token=${token}` })
            .then(res => {
            return response.status(201).json({
                message: ['A verification link has been resent to your email. Link expires in 15mins'],
                status: "success",
                statusCode: 200,
                payload: null
            });
        });
    }
    catch (error) {
        return response.status(400).send({ message: error.message });
    }
});
exports.resendVerificationLink = resendVerificationLink;
const resetUserPassword = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = request.body;
    let { apiKey } = request.params;
    try {
        let user = yield users_1.default.getUserByJsonbData("email", email);
        let { reset_password_url } = yield clusters_1.default.getClusterById(apiKey);
        if (!user) {
            return response.status(400).send({ message: "Email does not exist" });
        }
        let token = jsonwebtoken_1.default.sign({ email: email, user_id: user.user_id }, config_1.default.SECRET, { expiresIn: "900000" });
        (0, sendEmail_1.default)({ email, url: `${reset_password_url}?token=${token}`, message: "reset your password", buttonText: "Reset Password" })
            .then(res => {
            return response.status(200).json({
                message: ['A reset password link has been sent to your email. Link expires in 15mins'],
                status: "success",
                statusCode: 200,
                payload: null
            });
        });
    }
    catch (error) {
        return response.status(400).send({ message: error.message });
    }
});
exports.resetUserPassword = resetUserPassword;
const changeUserPassword = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = request.params;
    const { newPassword } = request.body;
    try {
        let { user_id, email } = jsonwebtoken_1.default.verify(token, config_1.default.SECRET);
        let hashedPassword = yield bcrypt_1.default.hash(newPassword, 7);
        let user = yield users_1.default.getUserById(user_id);
        let updatedData = Object.assign(Object.assign({}, user.data), { password: hashedPassword });
        let updatedUser = yield users_1.default.updateUser(user_id, updatedData);
        if (updatedUser) {
            return response.status(200).json({
                message: ["Password Reset Successful"],
                status: "success",
                statusCode: 200,
                payload: updatedUser
            });
        }
    }
    catch (error) {
        return response.status(400).send({ message: error.message });
    }
});
exports.changeUserPassword = changeUserPassword;
//# sourceMappingURL=authControllers.js.map