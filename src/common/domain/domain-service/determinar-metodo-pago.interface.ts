import { Order } from "src/order/domain/order";
import { Result } from "../result-handler/Result";
import { PaymentMethodId } from "src/payment-method/domain/value-objects/payment-method-id";
import { IPaymentMethodRepository } from "src/payment-method/domain/repositories/payment-method-repository.interface";

export interface IPaymentMethod {

    /*constructor(
        id_payment: PaymentMethodId,
        paymentMethodRepository: IPaymentMethodRepository
    ) {

    }*/

    execute(orden: Order): Promise<Result<Order>>

}