'use strict';

const Nodemailer = require('nodemailer');
const { Service } = require('@hapipal/schmervice');

module.exports = class MailService extends Service {

    async sendWelcomeEmail(userEmail) {
        // Create a Nodemailer transporter using Ethereal Email
        const transporter = Nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD
            }
        });

        // Define the email options
        const mailOptions = {
            from: '"My App" <no-reply@myapp.com>', // sender address
            to: userEmail, // list of receivers
            subject: 'Bienvenue la team', // Subject line
            text: 'Bien ou quoi ? On ne service renove pas ???' // plain text body
        };

        // Send the email
        const info = await transporter.sendMail(mailOptions);

        console.log('Mail envoyé: %s', info.messageId);
    }
};
