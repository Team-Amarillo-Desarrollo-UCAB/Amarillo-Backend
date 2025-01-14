import { IdGenerator } from "src/common/application/id-generator/id-generator.interface"
import { IPaymentMethod } from "src/common/domain/domain-service/determinar-metodo-pago.interface"
import { Result } from "src/common/domain/result-handler/Result"
import { OrderPayment } from "src/order/domain/entites/order-payment"
import { Order } from "src/order/domain/order"
import { OrderPaymentCurrency } from "src/order/domain/value-object/oder-payment/order-payment-currency"
import { OrderPaymentId } from "src/order/domain/value-object/oder-payment/order-payment-id"
import { OrderPaymentName } from "src/order/domain/value-object/oder-payment/order-payment-name"
import { OrderPaymentTotal } from "src/order/domain/value-object/oder-payment/order-payment-total"
import { EnumPaymentMethod } from "src/payment-method/domain/enum/PaymentMethod"
import { IPaymentMethodRepository } from "src/payment-method/domain/repositories/payment-method-repository.interface"
import { PaymentMethodId } from "src/payment-method/domain/value-objects/payment-method-id"

export class StripePaymentMethodMock implements IPaymentMethod {

    constructor(
        private readonly idGenerator: IdGenerator<string>,
        private readonly paymentMethodRepository: IPaymentMethodRepository,
        private readonly idPayment: string
    ) { }

    async execute(orden: Order): Promise<Result<Order>> {

        const method = await this.paymentMethodRepository.findPaymentMethodById(this.idPayment)

        if (!method.isSuccess())
            return Result.fail<Order>(method.Error, 404, method.Message)

        const pago = OrderPayment.create(
            OrderPaymentId.create(await this.idGenerator.generateId()),
            OrderPaymentName.create(EnumPaymentMethod.STRIPE),
            OrderPaymentCurrency.create(orden.Moneda),
            OrderPaymentTotal.create(orden.Monto.Total),
            PaymentMethodId.create(method.Value.Id.Id),
        )

        orden.asignarMetodoPago(pago)

        return Result.success<Order>(orden, 200)
    }

}