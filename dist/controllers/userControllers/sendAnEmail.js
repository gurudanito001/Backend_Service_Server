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
exports.sendAnEmail = void 0;
const sendEmail_1 = __importDefault(require("../../services/sendEmail"));
const sendAnEmail = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    (0, sendEmail_1.default)(request.body.email, request.body.url, request.body.token)
        .then(res => {
        return response.send(res);
    })
        .catch(error => {
        response.send(error.message);
    });
});
exports.sendAnEmail = sendAnEmail;
//# sourceMappingURL=sendAnEmail.js.map