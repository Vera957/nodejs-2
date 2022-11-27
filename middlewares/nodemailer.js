require('dotenv').config();
const { USER, PASS } = process.env
const nodemailer = require("nodemailer");

async function mailSender(email, token) {
    try {
        const transport = nodemailer.createTransport({
            host: "smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: USER,
                pass: PASS,
            }
        });

        const link = `localhost:3000/api/users/verify/${token} `

        const verifyLetter = {
            from: "good.answer.e@gmail.com",
            to: email,
            subject: "Contact app verify email",
            html: `<a href=${link} target="_blank">click here to verify email</a>`,
            text: `follow link ${link} to verify account`,
        };

         await transport.sendMail(verifyLetter);
    } catch (error) {
        console.log('error', error)
    }
    
}

module.exports = {
    mailSender,
}

