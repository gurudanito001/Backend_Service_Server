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
exports.confirmEmail = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
const clusters_1 = __importDefault(require("../../dbServices/clusters"));
const confirmEmail = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = request.params;
    try {
        let userData = jsonwebtoken_1.default.verify(token, config_1.default.SECRET);
        let clusterData = yield clusters_1.default.verifyEmail(userData.cluster_id);
        if (clusterData) {
            return response.status(201).json({
                messages: ["Email Confirmed Successfully"],
                status: "success",
                statusCode: 201,
                payload: null
            });
        }
    }
    catch (error) {
        return response.status(400).send({ message: error.message });
    }
});
exports.confirmEmail = confirmEmail;
//# sourceMappingURL=confirmEmail.js.map