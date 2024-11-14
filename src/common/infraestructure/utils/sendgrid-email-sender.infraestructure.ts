import * as sgMail from "@sendgrid/mail"

import { IEmailSender } from "src/common/application/email-sender/email-sender.interface.application"

export abstract class JetEmailSender implements IEmailSender {
    private subjectText: string
    private textPart: string
    private senderEmail = process.env.SENDGRID_API
    private senderName = process.env.APP_NAME
    private sendgrid = null
    private templateId = 5969844
    private variables = {}

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

    public sendEmail(
        emailReceiver: string, nameReceiver: string
    ) {
        
        const message = {
            To: [ { Email: emailReceiver, Name: nameReceiver, }, ],
            from: "labastidas.21@est.ucab.ed",
            subject: "Hello from Luigi",
            text: "Hello from Luigi",
            html: "<h1>Hello world it's me Hi</h1>"
        }
        
        sgMail.send(message)

    }
}