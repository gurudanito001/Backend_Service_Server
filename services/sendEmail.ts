import { Send } from 'express';
import * as Nodemailer from 'nodemailer';

interface SendEmailParams {
    email: string,
    url: string,
    message?: string,
    buttonText?: string
}
// async..await is not allowed in global scope, must use a wrapper
export default async function sendEmail({ email, url, message = "verify your email address", buttonText = "Confirm Email"  }: SendEmailParams ) : Promise<any> {

    let transporter = Nodemailer.createTransport({
        name: "www.agronigeria.ng",
        host: "mail.agronigeria.ng",
        port: 465,
        secure: true, // true for 465, false for other ports
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
    let info = await transporter.sendMail(mailDetails);
    if(info){
        return{
            success: true,
            message: `Check your email: ${email}, click on the button to ${message}`
        }
    }
    
}