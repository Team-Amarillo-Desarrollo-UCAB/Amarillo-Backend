export interface IEmailSender {
    setVariables( variables: string ): void
    sendEmail(emailReceiver: string, nameReceiver: string): void
}