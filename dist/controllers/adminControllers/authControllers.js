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
exports.changeClusterPassword = exports.resetClusterPassword = exports.resendClusterVerificationLink = exports.confirmClusterEmail = exports.authenticateCluster = exports.registerCluster = void 0;
const sendEmail_1 = __importDefault(require("../../services/sendEmail"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../../config"));
const clusters_1 = __importDefault(require("../../dbServices/clusters"));
const validator_1 = __importDefault(require("validator"));
const registerCluster = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, description, multi_tenant, test_string } = request.body;
    if (!email || !password) {
        return response.status(400).send({ message: "Email and Password fields are required" });
    }
    if (!validator_1.default.isEmail(email)) {
        return response.status(400).send({ message: "Email is not valid" });
    }
    if (validator_1.default.isEmpty(password)) {
        return response.status(400).send({ message: "Password is required" });
    }
    try {
        let hashedPassword = yield bcrypt_1.default.hash(password, 7);
        let emailExists = yield clusters_1.default.valueExists("clusters", "email", email);
        if (emailExists) {
            return response.status(400).send({ message: "Email Already Exists" });
        }
        let cluster = yield clusters_1.default.createCluster({ name, email, password: hashedPassword, description, multi_tenant });
        if (cluster) {
            let unSignedData = { email: cluster.email, cluster_id: cluster.cluster_id };
            const token = jsonwebtoken_1.default.sign(unSignedData, config_1.default.SECRET, {
                expiresIn: "900000" //15mins
            });
            if (test_string === config_1.default.TEST_STRING.toString()) {
                return response.status(201).json({
                    message: [`Cluster created successfully`],
                    status: "success",
                    statusCode: 200,
                    payload: cluster,
                    token: token
                });
            }
            (0, sendEmail_1.default)({ email: cluster.email, url: `${config_1.default.FRONTEND_URL}/auth/verifyEmail?token=${token}` })
                .then(res => {
                return response.status(200).json({
                    message: [res.message],
                    status: "success",
                    statusCode: 200,
                    payload: cluster
                });
            });
        }
    }
    catch (error) {
        return response.status(400).json({ message: error.message });
    }
});
exports.registerCluster = registerCluster;
const authenticateCluster = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = request.body;
    try {
        const cluster = yield clusters_1.default.getClusterByParams('email = $1', [email]);
        if (!cluster) {
            return response.status(404).json({ message: "Invalid Email or Password" });
        }
        const isValidPassword = yield bcrypt_1.default.compare(password, cluster.password);
        if (!isValidPassword) {
            return response.status(404).json({ message: "Invalid Email or Password" });
        }
        if (!cluster.email_confirmed) {
            return response.status(400).json({ message: "Email not verified" });
        }
        return response.status(201).json({
            message: [`Login Successful`],
            status: "success",
            statusCode: 200,
            payload: cluster
        });
    }
    catch (error) {
        return response.status(400).send({ message: error.message });
    }
});
exports.authenticateCluster = authenticateCluster;
const confirmClusterEmail = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = request.params;
    try {
        let { cluster_id, email } = jsonwebtoken_1.default.verify(token, config_1.default.SECRET);
        let clusterExists = yield clusters_1.default.clusterExists(cluster_id);
        if (!clusterExists) {
            return response.status(404).json({ message: "Cluster does not exist" });
        }
        let clusterData = yield clusters_1.default.verifyEmail(cluster_id, email);
        if (clusterData) {
            return response.status(201).json({
                message: ["Email Confirmed Successfully"],
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
exports.confirmClusterEmail = confirmClusterEmail;
const resendClusterVerificationLink = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    let { email } = request.params;
    if (!validator_1.default.isEmail(email)) {
        return response.status(400).send({ message: "Email is not valid" });
    }
    try {
        let cluster = yield clusters_1.default.getClusterByParams('email = $1', [email]);
        if (!cluster) {
            return response.status(404).send({ message: "Cluster does not exist" });
        }
        if (cluster.email_confirmed) {
            return response.status(400).send({ message: "Cluster email already verified" });
        }
        let unSignedData = { email: email, cluster_id: cluster.cluster_id };
        const token = jsonwebtoken_1.default.sign(unSignedData, config_1.default.SECRET, {
            expiresIn: "900000" //15mins
        });
        (0, sendEmail_1.default)({ email, url: `${config_1.default.FRONTEND_URL}/auth/verifyEmail?token=${token}` })
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
exports.resendClusterVerificationLink = resendClusterVerificationLink;
const resetClusterPassword = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = request.body;
    try {
        let emailExists = yield clusters_1.default.valueExists("clusters", "email", email);
        if (!emailExists) {
            return response.status(400).send({ message: "Email does not exist" });
        }
        let token = jsonwebtoken_1.default.sign({ email }, config_1.default.SECRET, { expiresIn: "900000" });
        (0, sendEmail_1.default)({ email, url: `${config_1.default.FRONTEND_URL}/auth/changePassword?token=${token}`, message: "reset your password", buttonText: "Reset Password" })
            .then(res => {
            return response.status(200).json({
                message: ['A reset link has been sent to your email. Link expires in 15mins'],
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
exports.resetClusterPassword = resetClusterPassword;
const changeClusterPassword = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = request.params;
    const { newPassword } = request.body;
    try {
        let hashedPassword = yield bcrypt_1.default.hash(newPassword, 7);
        let { email } = jsonwebtoken_1.default.verify(token, config_1.default.SECRET);
        let clusterData = yield clusters_1.default.updateClusterByParams("password = $1", "email = $2", [hashedPassword, email]);
        if (clusterData) {
            return response.status(201).json({
                message: ["Password Reset Successful"],
                status: "success",
                statusCode: 201,
                payload: clusterData
            });
        }
    }
    catch (error) {
        return response.status(400).send({ message: error.message });
    }
});
exports.changeClusterPassword = changeClusterPassword;
//# sourceMappingURL=authControllers.js.map