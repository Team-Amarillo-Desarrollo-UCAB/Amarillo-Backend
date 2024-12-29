import { IdGenerator } from "src/common/application/id-generator/id-generator.interface";
import { IPaymentMethod } from "src/common/domain/domain-service/determinar-metodo-pago.interface";
import { Result } from "src/common/domain/result-handler/Result";
import { OrderPayment } from "src/order/domain/entites/order-payment";
import { Order } from "src/order/domain/order";
import { OrderPaymentId } from "src/order/domain/value-object/oder-payment/order-payment-id";
import { OrderPaymentName } from "src/order/domain/value-object/oder-payment/order-payment-name";
import { EnumPaymentMethod } from "src/payment-method/domain/enum/PaymentMethod";
import { OrderPaymentCurrency } from '../../../order/domain/value-object/oder-payment/order-payment-currency';

export class PaypalPaymentMethod implements IPaymentMethod {

    private readonly email_paypal: string
    private readonly idGenerator: IdGenerator<string>

    constructor(email: string, idGenerator: IdGenerator<string>) {
        this.email_paypal = email
        this.idGenerator = idGenerator
    }

    async execute(orden: Order): Promise<Result<Order>> {

        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!regex.test(this.email_paypal)) {
            return Result.fail<Order>(new Error("Email del paypalno es valido"), 404, "Email del paypalno es valido")
        }

        const pago = OrderPayment.create(
            OrderPaymentId.create(await this.idGenerator.generateId()),
            OrderPaymentName.create(EnumPaymentMethod.PAYPAL),
            OrderPaymentCurrency.create(orden.Moneda),
            orden.Monto,
        )

        orden.asignarMetodoPago(pago)


        return Result.success<Order>(orden, 200)
    }

}