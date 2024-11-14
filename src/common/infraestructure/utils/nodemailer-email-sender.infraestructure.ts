/* eslint-disable @typescript-eslint/no-unused-vars */
import * as nodemailer from "nodemailer";

import { IEmailSender } from "src/common/application/email-sender/email-sender.interface.application"

export class NodemailerEmailSender implements IEmailSender {
    private userGmail = "jamalcuent@gmail.com";
    private passAppGmail = "aauo ubdh gehy xyjp";
    private senderName = process.env.APP_NAME
    private transporter = null

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: this.userGmail,
                pass: this.passAppGmail,
            },
        });
    }

    async sendEmail(emailReceiver: string, nameReceiver: string,order_id: string) {

        try {

            if (!this.transporter)
                throw new Error("Transporte no configurado")

            const mailOptions = {
                from: this.userGmail,
                to: emailReceiver,
                subject: "Eres una lacra",
                text: "Eres una mega lacra Jamaaal!",
                html: `<h1>Su orden ha sido creada, la orden #${order_id}</h1>`
            };

            this.transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log("Error al enviar correo:", error);
                } else {
                    console.log("Correo enviado:", info.response);
                }
            });

        } catch (error) {

        }

    }


}