export interface IEmailSender {
    // TODO: Arreglar este problema porque no siempre se enviara el id de la orden
    sendEmail(emailReceiver: string, nameReceiver: string, order_id: string,data_product?:{name: string, image: string, quantity: number}[]): void
}