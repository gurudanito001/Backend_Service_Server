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
exports.getAllUsers = void 0;
const users_1 = __importDefault(require("../../dbServices/users"));
const getAllUsers = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    let { apiKey } = request.params;
    try {
        let allUsers = yield users_1.default.getAllUsersByClusterId(apiKey);
        return response.status(200).json({
            message: [`Users fetched SuccessFully`],
            status: "success",
            statusCode: 200,
            payload: allUsers
        });
    }
    catch (error) {
        return response.status(400).json({ message: error.message });
    }
});
exports.getAllUsers = getAllUsers;
//# sourceMappingURL=getAllUsers.js.map