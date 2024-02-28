'use strict';

const Nodemailer = require('nodemailer');
const { Service } = require('@hapipal/schmervice');
const amqp = require('amqplib/callback_api');

module.exports = class MailService extends Service {

    async sendWelcomeEmail(userEmail) {
        const testAccount = await Nodemailer.createTestAccount();

        // Create a Nodemailer transporter using Ethereal Email
        const transporter = Nodemailer.createTransport({
            host: testAccount.smtp.host,
            port: testAccount.smtp.port,
            secure: testAccount.smtp.secure,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass
            }
        });

        // Define the email options
        const mailOptions = {
            from: '"Apagnan" <no-reply@apagnan.com>', // sender address
            to: userEmail, // list of receivers
            subject: 'Bienvenue la team', // Subject line
            text: 'Bien ou quoi ? On ne service renove pas ???' // plain text body
        };

        // Connect to RabbitMQ and create a channel
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

                // Send the email to the queue
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

                // Start consuming messages
                channel.consume(queue, async (msg) => {
                    console.log('Message reçu de la file d\'attente:', msg.content.toString());

                    const email = JSON.parse(msg.content.toString());

                    const testAccount = await Nodemailer.createTestAccount();

                    // Create a Nodemailer transporter using Ethereal Email
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
