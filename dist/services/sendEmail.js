"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Nodemailer = __importStar(require("nodemailer"));
// async..await is not allowed in global scope, must use a wrapper
function sendEmail({ email, url, message = "verify your email address", buttonText = "Confirm Email" }) {
    return __awaiter(this, void 0, void 0, function* () {
        let transporter = Nodemailer.createTransport({
            name: "www.agronigeria.ng",
            host: "mail.agronigeria.ng",
            port: 465,
            secure: true,
            auth: {
                user: "no-reply@agronigeria.ng",
                pass: "AgroNigA!!en90",
            },
        });
        let mailDetails = {
            from: 'no-reply@agronigeria.ng',
            to: `${email}`,
            subject: 'Account Verification Link',
            text: 'Follow the instructions below',
            html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; text-align: center;">
            <h1>Marlayer Web Services</h1>
            <p>Click on the button below to ${message}</p>
            <a
            href="${url}"
            target="_blank"
            style="display: block; width: 250px; border-radius: 25px; border: 1px solid #1942D8; background: #1942D8; color: white; margin: 30px auto; text-align: center; padding: 15px 0px">
            ${buttonText}
            </a>
            <p style="line-height: 1.3rem;">
            Thanks <br />
            <em>The Marlayer Web Services Team</em>
            </p>
        </div>
        `
        };
        let info = yield transporter.sendMail(mailDetails);
        if (info) {
            return {
                success: true,
                message: `Check your email: ${email}, click on the button to ${message}`
            };
        }
    });
}
exports.default = sendEmail;
//# sourceMappingURL=sendEmail.js.map