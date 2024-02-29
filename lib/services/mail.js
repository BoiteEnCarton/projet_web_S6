'use strict';

const Nodemailer = require('nodemailer');
const { Service } = require('@hapipal/schmervice');
const amqp = require('amqplib/callback_api');

module.exports = class MailService extends Service {

    async sendNotification(email, subject, content) {
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
            from: '"Apagnan" <apagnan@boiteencarton.com>',
            to: email,
            subject,
            text: content
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
    async sendCsvEmail(email, subject, content, csvFilePath) {
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
            from: '"Apagnan" <apagnan@boiteencarton.com>',
            to: email,
            subject,
            text: content,
            attachments: [
                {
                    filename: 'movies.csv',
                    path: csvFilePath
                }
            ]
        };

        const mailOptionsJSON = JSON.stringify(mailOptions);

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

                channel.sendToQueue(queue, Buffer.from(mailOptionsJSON));

                console.log('Email envoyé à la file d\'attente RabbitMQ');
            });
        });

        await transporter.sendMail(mailOptions);
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
            from: '"Apagnan" <apagnan@boiteencarton.com>', 
            to: userEmail, 
            subject: 'Bienvenue la team', 
            text: 'Bien ou quoi ? On ne service renove pas ???' 
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
