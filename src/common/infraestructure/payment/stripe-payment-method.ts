import Stripe from 'stripe'

import { IPaymentMethod } from "src/common/domain/domain-service/determinar-metodo-pago.interface";
import { Result } from "src/common/domain/result-handler/Result";
import { Order } from "src/order/domain/order";
import { OrderPayment } from 'src/order/domain/entites/order-payment';
import { IdGenerator } from 'src/common/application/id-generator/id-generator.interface';
import { OrderPaymentId } from 'src/order/domain/value-object/oder-payment.ts/order-payment-id';
import { OrderPaymentName } from 'src/order/domain/value-object/oder-payment.ts/order-payment-name';
import { EnumPaymentMethod } from 'src/payment-method/domain/enum/PaymentMethod';
import { OrderPaymentCurrency } from 'src/order/domain/value-object/oder-payment.ts/order-payment-currency';

export class StripePaymentMethod implements IPaymentMethod {

    private readonly idGenerator: IdGenerator<string>
    private readonly stripe: Stripe
    private idStripe: string

    constructor(id: string, idGenerator: IdGenerator<string>) {
        this.stripe = new Stripe(process.env.STRIPE_API_SECRET);
        this.idStripe = id
        this.idGenerator = idGenerator
    }

    async execute(orden: Order): Promise<Result<Order>> {
        try {
            // Crea un PaymentIntent con el token del frontend;
            const paymentIntent = await this.stripe.paymentIntents.create({
                amount: orden.Monto.Total * 100,
                currency: 'usd',
                confirm: true,
                payment_method: this.idStripe,
                payment_method_types: ['card'],
            });


            const pago = OrderPayment.create(
                OrderPaymentId.create(await this.idGenerator.generateId()),
                OrderPaymentName.create(EnumPaymentMethod.STRIPE),
                OrderPaymentCurrency.create(orden.Moneda),
                orden.Monto
            )

            console.log("El pago fue procesado")
            // Si el pago es exitoso, devuelve un estado con el resultado
            return Result.success<Order>(orden, 200)
        } catch (error) {
            console.error('Payment failed:', error);
            return Result.fail(new Error("Payment stripe failed"), 404, 'Payment failed')
        }
    }

}