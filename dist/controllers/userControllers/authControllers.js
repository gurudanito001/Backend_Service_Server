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
exports.changeUserPassword = exports.resetUserPassword = exports.confirmUserEmail = void 0;
const sendEmail_1 = __importDefault(require("../../services/sendEmail"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../../config"));
const users_1 = __importDefault(require("../../dbServices/users"));
const clusters_1 = __importDefault(require("../../dbServices/clusters"));
/* export const sendAnEmail = async (request: Request, response: Response) =>{
  sendEmail(request.body.email, request.body.url)
  .then(res =>{
    return response.send(res)
  })
  .catch(error =>{
    response.send(error.message)
  })
} */
const confirmUserEmail = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = request.params;
    try {
        let { user_id, email } = jsonwebtoken_1.default.verify(token, config_1.default.SECRET);
        let userData = yield users_1.default.verifyEmail(user_id, email);
        if (userData) {
            return response.status(200).json({
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
exports.confirmUserEmail = confirmUserEmail;
const resetUserPassword = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = request.body;
    //check if email exists in the system
    try {
        let emailExists = yield clusters_1.default.JsonbDataExists("users", "email", email);
        if (!emailExists) {
            return response.status(400).send({ message: "Email does not exist" });
        }
        let token = jsonwebtoken_1.default.sign({ email }, config_1.default.SECRET, { expiresIn: "900000" });
        (0, sendEmail_1.default)(email, `${config_1.default.API_BASE_URL}/auth/changePassword/${token}`, "reset your password")
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
exports.resetUserPassword = resetUserPassword;
const changeUserPassword = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.changeUserPassword = changeUserPassword;
//# sourceMappingURL=authControllers.js.map