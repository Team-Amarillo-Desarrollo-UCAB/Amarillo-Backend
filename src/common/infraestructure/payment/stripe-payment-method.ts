import Stripe from 'stripe'

import { IPaymentMethod } from "src/common/domain/domain-service/determinar-metodo-pago.interface";
import { Result } from "src/common/domain/result-handler/Result";
import { Order } from "src/order/domain/order";
import { OrderPayment } from 'src/order/domain/entites/order-payment';
import { IdGenerator } from 'src/common/application/id-generator/id-generator.interface';
import { OrderPaymentId } from 'src/order/domain/value-object/oder-payment/order-payment-id';
import { OrderPaymentName } from 'src/order/domain/value-object/oder-payment/order-payment-name';
import { EnumPaymentMethod } from 'src/payment-method/domain/enum/PaymentMethod';
import { OrderPaymentCurrency } from 'src/order/domain/value-object/oder-payment/order-payment-currency';
import { IPaymentMethodRepository } from 'src/payment-method/domain/repositories/payment-method-repository.interface';
import { Moneda } from 'src/product/domain/enum/Monedas';
import { OrderPaymentTotal } from 'src/order/domain/value-object/oder-payment/order-payment-total';

export class StripePaymentMethod implements IPaymentMethod {

    private readonly idGenerator: IdGenerator<string>
    private readonly paymentMethodRepository: IPaymentMethodRepository
    private readonly stripe: Stripe
    private readonly idPayment: string
    private token: string

    constructor(
        id: string,
        idGenerator: IdGenerator<string>,
        paymentMethodRepository: IPaymentMethodRepository,
        idPayment: string
    ) {
        this.stripe = new Stripe(process.env.STRIPE_API_SECRET);
        this.token = id
        this.idGenerator = idGenerator
        this.paymentMethodRepository = paymentMethodRepository
        this.idPayment = idPayment
    }

    async execute(orden: Order): Promise<Result<Order>> {
        try {
            const id_payment = await this.idGenerator.generateId()
            const method = await this.paymentMethodRepository.findPaymentMethodById(this.idPayment)

            if (!method.isSuccess())
                return Result.fail<Order>(method.Error, 404, method.Message)

            // Crea un PaymentIntent con el token del frontend;
            const paymentIntent = await this.stripe.paymentIntents.create({
                amount: orden.Monto.Total * 100,
                currency: 'usd',
                confirm: true,
                payment_method: this.token,
                payment_method_types: ['card'],
                metadata: {
                    id_orden: orden.Id.Id,
                    id_pago: id_payment,  // Un identificador personalizado
                }
            });

            // Loggeamos la respuesta del PaymentIntent en la consola
            console.log('Pago realizado con éxito:', paymentIntent);

            const pago = OrderPayment.create(
                OrderPaymentId.create(id_payment),
                OrderPaymentName.create(EnumPaymentMethod.STRIPE),
                OrderPaymentCurrency.create(Moneda.USD),
                OrderPaymentTotal.create(orden.Monto.Total)
            )

            orden.asignarMetodoPago(pago)

            return Result.success<Order>(orden, 200)
        } catch (error) {
            console.error('Payment failed:', error);
            return Result.fail(new Error("Payment stripe failed"), 404, 'Payment failed')
        }
    }

}