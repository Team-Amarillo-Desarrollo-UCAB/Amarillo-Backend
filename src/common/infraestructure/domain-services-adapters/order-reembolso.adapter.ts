import { IOrderReembolsoPort } from "src/common/domain/domain-service/order-reembolso.port";
import { Result } from "src/common/domain/result-handler/Result";
import { Order } from "src/order/domain/order";
import Stripe from "stripe";


export class StripeOrderReembolsoAdapter implements IOrderReembolsoPort {
  private readonly stripe: Stripe;

  constructor(stripeSecretKey: string) {
    this.stripe = new Stripe(stripeSecretKey, { apiVersion: "2024-11-20.acacia" });
  }

  async execute(orden: Order): Promise<Result<string>> {
    try {

      const paymentIntents = await this.stripe.paymentIntents.list()

      const id = orden.Id.Id

      const pagos_realizados = paymentIntents.data.filter((paymentIntent) => {
        return paymentIntent.metadata.id_pago === id;  // ID personalizado que buscaste
      });

      if (pagos_realizados.length > 0) {
        const paymentIntent = pagos_realizados[0];  // Tomamos el primer resultado encontrado
        console.log('PaymentIntent encontrado:', paymentIntent);

        // Realizamos el reembolso con el PaymentIntent encontrado
        const reembolso = await this.stripe.refunds.create({
          payment_intent: paymentIntent.id
        });
        console.log('Reembolso procesado:', reembolso);

        if (reembolso.status === "succeeded") {
          return Result.success<string>(
            `Reembolso exitoso. ID: ${reembolso.id}`,
            200
          );
        }

        return Result.fail<string>(
          new Error(`Reembolso fallido. Estado: ${reembolso.status}`),
          500,
          "No se pudo procesar el reembolso."
        );
      } else {
        console.log('No se encontró el PaymentIntent con ese ID de pago.');
      }




    } catch (error) {
      return Result.fail<string>(
        new Error("Error al procesar el reembolso con Stripe."),
        500,
        error.message
      );
    }
  }
}
