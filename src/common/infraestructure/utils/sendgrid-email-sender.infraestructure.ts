import * as sgMail from "@sendgrid/mail"
import * as formData from 'form-data';
import Mailgun from "mailgun.js"; // Importa Mailgun


import { IEmailSender } from "src/common/Application/email-sender/email-sender.interface.application"

export class JetEmailSender implements IEmailSender {
    private subjectText: string
    private textPart: string
    private senderName = process.env.APP_NAME
    private sendgrid = null
    private templateId = 5969844
    private variables = {}
    private mg

    constructor() {
        const key_public = process.env.SENDGRID_API
        this.sendgrid = sgMail.setApiKey(key_public)
    }

    public setVariables(variables: string) {
        this.variables = variables
    }

    public setTextPart(text: string) {
        this.textPart = text
    }

    public setTemplateId(templateId: number) {
        this.templateId = templateId
    }

    public setSubjectText(text: string) {
        this.subjectText = text
    }
 
    public async sendEmail(emailReceiver: string, nameReceiver: string) {
        const message = {
            to: emailReceiver,
            from: "labastidas.21@est.ucab.edu.ve",  // O la dirección de correo correcta para ti
            subject: `Hello from ${nameReceiver}`,
            text: "Hello from Luigi",
            html: "<h1>Hello world it's me Hi</h1>",
        };

        try {
            const response = await sgMail.send(message);
            console.log('Email sent...', response);
            return response;
        } catch (error) {
            console.error("Error en el envío: ", error.response ? error.response.body : error.message);
            throw new Error("No se pudo enviar el correo.");
        }


    }

    async sendEmailMailGun(emailReceiver: string, nameReceiver: string) {

        const mailgun = new Mailgun(formData);
        const mg = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY || 'key-yourkeyhere' });
        console.log(mg)
        mg.messages.create('sandbox-123.mailgun.org', {
            from: "Excited User <mailgun@sandbox5ef433e59dd3444c9091d368d0c0fa40.mailgun.org>",
            to: [emailReceiver],
            subject: "Hello",
            text: "Testing some Mailgun awesomeness!",
            html: "<h1>Testing some Mailgun awesomeness!</h1>"
        })
            .then(msg => console.log(msg)) // logs response data
            .catch(err => console.log("Error en el envio: ",err.message));

    }

}