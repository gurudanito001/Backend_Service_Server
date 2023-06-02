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
exports.getUserById = void 0;
const users_1 = __importDefault(require("../../dbServices/users"));
const getUserById = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { apiKey, userId } = request.params;
    try {
        let user = yield users_1.default.getUserById(userId);
        if (user) {
            if (user.cluster_id !== apiKey) {
                return response.status(400).json({ message: "User does not belong in cluster" });
            }
            return response.status(200).json({
                message: [`User fetched SuccessFully`],
                status: "success",
                statusCode: 200,
                payload: user
            });
        }
        return response.status(404).json({ message: "User Not Found" });
    }
    catch (error) {
        return response.status(400).json({ message: error.message });
    }
});
exports.getUserById = getUserById;
//# sourceMappingURL=getUserById.js.map