import { IdGenerator } from "src/common/application/id-generator/id-generator.interface";
import { IPaymentMethod } from "src/common/domain/domain-service/determinar-metodo-pago.interface";
import { Result } from "src/common/domain/result-handler/Result";
import { OrderPayment } from "src/order/domain/entites/order-payment";
import { Order } from "src/order/domain/order";
import { OrderPaymentId } from "src/order/domain/value-object/oder-payment/order-payment-id";
import { OrderPaymentName } from "src/order/domain/value-object/oder-payment/order-payment-name";
import { EnumPaymentMethod } from "src/payment-method/domain/enum/PaymentMethod";
import { OrderPaymentCurrency } from '../../../order/domain/value-object/oder-payment/order-payment-currency';
import { OrderPaymentTotal } from "src/order/domain/value-object/oder-payment/order-payment-total";
import { IPaymentMethodRepository } from "src/payment-method/domain/repositories/payment-method-repository.interface";
import { PaymentMethodName } from "src/payment-method/domain/value-objects/payment-method-name";
import { PaymentMethodId } from "src/payment-method/domain/value-objects/payment-method-id";
import { PaymentMethodState } from "src/payment-method/domain/value-objects/payment-method-state";
import { InvalidPaymentMethod } from "src/payment-method/domain/domain-exception/invalid-payment-method";

export class PaypalPaymentMethod implements IPaymentMethod {

    private readonly email_paypal: string
    private readonly idGenerator: IdGenerator<string>
    private readonly paymentMethodRepository: IPaymentMethodRepository
    private readonly idPayment: string

    constructor(
        email: string,
        idGenerator: IdGenerator<string>,
        paymentMethodRepository: IPaymentMethodRepository,
        idPayment: string
    ) {
        this.email_paypal = email
        this.idPayment = idPayment
        this.idGenerator = idGenerator
        this.paymentMethodRepository = paymentMethodRepository
    }

    async execute(orden: Order): Promise<Result<Order>> {

        const method = await this.paymentMethodRepository.findPaymentMethodById(this.idPayment)

        if (!method.isSuccess())
            return Result.fail<Order>(method.Error, 404, method.Message)

        if (!method.Value.NameMethod().equals(PaymentMethodName.create(EnumPaymentMethod.PAYPAL)))
            return Result.fail<Order>(new Error('El id no corresponde al metodo de pago'), 404, 'El id no corresponde al metodo de pago')

        if (method.Value.Status().equals(PaymentMethodState.create(false)))
            return Result.fail<Order>(new InvalidPaymentMethod('El metodo de pago esta desabilitado'), 500, 'El metodo de pago esta desabilitado')

        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!regex.test(this.email_paypal)) {
            return Result.fail<Order>(new Error("Email del paypalno es valido"), 404, "Email del paypalno es valido")
        }

        const pago = OrderPayment.create(
            OrderPaymentId.create(await this.idGenerator.generateId()),
            OrderPaymentName.create(EnumPaymentMethod.PAYPAL),
            OrderPaymentCurrency.create(orden.Moneda),
            OrderPaymentTotal.create(orden.Monto.Total),
            PaymentMethodId.create(method.Value.Id.Id),
        )

        orden.asignarMetodoPago(pago)


        return Result.success<Order>(orden, 200)
    }

}