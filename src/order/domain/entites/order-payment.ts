import { Entity } from "src/common/domain/entity/entity";
import { OrderPaymentId } from "../value-object/oder-payment/order-payment-id";
import { OrderPaymentName } from "../value-object/oder-payment/order-payment-name";
import { OrderPaymentCurrency } from "../value-object/oder-payment/order-payment-currency";
import { OrderTotal } from "../value-object/order-total";
import { OrderPaymentTotal } from "../value-object/oder-payment/order-payment-total";
import { PaymentMethodId } from "src/payment-method/domain/value-objects/payment-method-id";

export class OrderPayment extends Entity<OrderPaymentId> {

    protected constructor(
        id: OrderPaymentId,
        private readonly name: OrderPaymentName,
        private readonly currency: OrderPaymentCurrency,
        private readonly amount: OrderPaymentTotal,
        private readonly paymentMethod?: PaymentMethodId,
    ) {
        super(id)
    }

    NameMethod(){
        return this.name
    }

    AmountPayment(){
        return this.amount
    }

    CurrencyPayment(){
        return this.currency
    }

    PaymentMethodId(){
        return this.paymentMethod
    }

    static create(
        id: OrderPaymentId,
        name: OrderPaymentName,
        currency: OrderPaymentCurrency,
        amount: OrderPaymentTotal,
        paymentMethod?: PaymentMethodId,
    ): OrderPayment{
        return new OrderPayment(id,name,currency,amount,paymentMethod)
    }

}