import { IOrderReembolsoPort } from "src/common/domain/domain-service/order-reembolso.port";
import { Result } from "src/common/domain/result-handler/Result";
import { EnumOrderEstados } from "src/order/domain/enum/order-estados-enum";
import { Order } from "src/order/domain/order";
import { OrderEstado } from "src/order/domain/value-object/order-estado";
import Stripe from "stripe";


export class StripeOrderReembolsoAdapter implements IOrderReembolsoPort {
  private readonly stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_API_SECRET, { apiVersion: "2024-11-20.acacia" });
  }

  async execute(orden: Order): Promise<Result<string>> {
    try {

      if (!orden.Estado.equals(OrderEstado.create(EnumOrderEstados.CANCELED)) &&
          !orden.Estado.equals(OrderEstado.create(EnumOrderEstados.CREADA))
        )
        return Result.fail<string>(new Error('La orden debe estar cancelada'), 403, 'La orden debe estar cancelada')

      const paymentIntents = await this.stripe.paymentIntents.list()

      const id = orden.Id.Id

      const pagos_realizados = paymentIntents.data.filter((paymentIntent) => {
        return paymentIntent.metadata.id_orden === id;  // ID personalizado que buscaste
      });

      if (pagos_realizados.length > 0) {
        const paymentIntent = pagos_realizados[0];  // Tomamos el primer resultado encontrado

        // Realizamos el reembolso con el PaymentIntent encontrado
        const reembolso = await this.stripe.refunds.create({
          payment_intent: paymentIntent.id
        });
        console.log('Reembolso procesado:', reembolso.status);

        if (reembolso.status === "succeeded") {
          return Result.success<string>(
            `Reembolso exitoso. ID: ${reembolso.id}`,
            200
          );
        }

        return Result.fail<string>(
          new Error(`Reembolso fallido: ${reembolso.status}`),
          500,
          "No se pudo procesar el reembolso."
        );
      } else {
        return Result.fail(new Error('El pago de la orden no esta en stripe'), 404, 'El pago de la orden no esta en stripe')
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
