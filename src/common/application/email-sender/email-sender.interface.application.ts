export interface IEmailSender {
    // TODO: Arreglar este problema porque no siempre se enviara el id de la orden
    sendEmail(emailReceiver: string, nameReceiver: string, orderId: string): void
}