import { IOrderReembolsoPort } from "src/common/domain/domain-service/order-reembolso.port";
import { Result } from "src/common/domain/result-handler/Result";
import { Order } from "src/order/domain/order";
import Stripe from "stripe";


export class StripeOrderReembolsoAdapter implements IOrderReembolsoPort {
  private readonly stripe: Stripe;

  constructor(stripeSecretKey: string) {
    this.stripe = new Stripe(stripeSecretKey, { apiVersion: "2024-11-20.acacia" });
  }

  async execute(o: Order): Promise<Result<string>> {
    try {
      
    const intentos = await this.stripe.paymentIntents.list({})

    const orderID = o.Id

    const stripeIntentos = intentos.data.find((i) => i.metadata.orderId === o.Id.Id)

      const refund = await this.stripe.refunds.create({
        payment_intent: stripeIntentos.id
      });

      if (refund.status === "succeeded") {
        return Result.success<string>(
          `Reembolso exitoso. ID: ${refund.id}`,
          200
        );
      }

      return Result.fail<string>(
        new Error(`Reembolso fallido. Estado: ${refund.status}`),
        500,
        "No se pudo procesar el reembolso."
      );
    } catch (error) {
      return Result.fail<string>(
        new Error("Error al procesar el reembolso con Stripe."),
        500,
        error.message
      );
    }
  }
}
