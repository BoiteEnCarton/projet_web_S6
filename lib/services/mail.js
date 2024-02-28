'use strict';

const Nodemailer = require('nodemailer');
const { Service } = require('@hapipal/schmervice');
const amqp = require('amqplib/callback_api');

module.exports = class MailService extends Service {

    async sendNotification(email, subject, content) {
        let transporter = Nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        let mailOptions = {
            from: process.env.EMAIL_USERNAME,
            to: email,
            subject: subject,
            text: content
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }
    async sendWelcomeEmail(userEmail) {
        const testAccount = await Nodemailer.createTestAccount();

        const transporter = Nodemailer.createTransport({
            host: testAccount.smtp.host,
            port: testAccount.smtp.port,
            secure: testAccount.smtp.secure,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass
            }
        });

        const mailOptions = {
            from: '"Apagnan" <apagnan@boiteencarton.com>', // sender address
            to: userEmail, // list of receivers
            subject: 'Bienvenue la team', // Subject line
            text: 'Bien ou quoi ? On ne service renove pas ???' // plain text body
        };

        amqp.connect('amqp://localhost', (error0, connection) => {
            if (error0) {
                throw error0;
            }

            connection.createChannel((error1, channel) => {
                if (error1) {
                    throw error1;
                }

                const queue = 'emailQueue';

                channel.assertQueue(queue, {
                    durable: false
                });

                channel.sendToQueue(queue, Buffer.from(JSON.stringify(mailOptions)));
            });
        });
    }

    startListeningForEmails() {
        amqp.connect('amqp://localhost', (error0, connection) => {
            if (error0) {
                console.error('Erreur de connexion à RabbitMQ:', error0);
                throw error0;
            }

            connection.createChannel((error1, channel) => {
                if (error1) {
                    console.error('Erreur de création du canal:', error1);
                    throw error1;
                }

                const queue = 'emailQueue';

                channel.assertQueue(queue, {
                    durable: false
                });

                console.log('En attente de messages dans la file d\'attente...');

                channel.consume(queue, async (msg) => {
                    console.log('Message reçu de la file d\'attente:', msg.content.toString());

                    const email = JSON.parse(msg.content.toString());

                    const testAccount = await Nodemailer.createTestAccount();

                    const transporter = Nodemailer.createTransport({
                        host: testAccount.smtp.host,
                        port: testAccount.smtp.port,
                        secure: testAccount.smtp.secure,
                        auth: {
                            user: testAccount.user,
                            pass: testAccount.pass
                        }
                    });

                    // Send the email
                    transporter.sendMail(email, (err, info) => {
                        if (err) {
                            console.error('Erreur lors de l\'envoi de l\'e-mail:', err);
                            return;
                        }

                        console.log('Mail envoyé: %s', info.messageId);
                        console.log('Preview URL: %s', Nodemailer.getTestMessageUrl(info));
                    });
                }, {
                    noAck: true
                });
            });
        });
    }
};
