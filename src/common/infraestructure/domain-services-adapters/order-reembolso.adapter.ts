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
      if (
        !orden.Estado.equals(OrderEstado.create(EnumOrderEstados.CANCELLED)) &&
        !orden.Estado.equals(OrderEstado.create(EnumOrderEstados.CREADA))
      ) {
        return Result.fail<string>(new Error('La orden debe estar cancelada'), 403, 'La orden debe estar cancelada');
      }

      let hasMore = true;
      let lastPaymentId: string = null; // Inicializamos como null para la primera llamada
      let pagoRealizado: Stripe.PaymentIntent[]
      // Paginación: obtenemos todos los pagos
      while (hasMore) {
        const paymentIntents = await this.stripe.paymentIntents.list({
          limit: 100, // Limita el número de pagos por página
          starting_after: lastPaymentId ? lastPaymentId : undefined, // Solo incluir starting_after después de la primera iteración
        });


        // Verificamos si ya encontramos el pago con el id_orden
        pagoRealizado = paymentIntents.data.filter((paymentIntent) => {
          return paymentIntent.metadata.id_orden === orden.Id.Id;
        });

        if (pagoRealizado.length > 0) {
          // Si encontramos el pago, salimos del bucle de paginación
          hasMore = false;
        } else {
          // Si no encontramos el pago, continuamos buscando
          hasMore = paymentIntents.has_more;
        }

        if (hasMore) {
          lastPaymentId = paymentIntents.data[paymentIntents.data.length - 1].id; // Actualizamos el id para la siguiente página
        }
      }

      if (pagoRealizado.length > 0) {
        const paymentIntent = pagoRealizado[0]; // Tomamos el primer resultado encontrado

        // Realizamos el reembolso con el PaymentIntent encontrado
        const reembolso = await this.stripe.refunds.create({
          payment_intent: paymentIntent.id,
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
        return Result.fail(new Error('El pago de la orden no está en Stripe'), 404, 'El pago de la orden no está en Stripe');
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