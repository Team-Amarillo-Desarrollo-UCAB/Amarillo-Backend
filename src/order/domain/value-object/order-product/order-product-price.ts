import { IValueObject } from "src/common/domain/value-object/value-object.interface";
import { OrderProductAmount } from './order-product-amount';
import { OrderProductCurrency } from "./order-product-currency";

export class OrderProductPrice implements IValueObject<OrderProductPrice> {

    private readonly amount: OrderProductAmount
    private readonly currency: OrderProductCurrency

    protected constructor(
        amount: OrderProductAmount,
        currency: OrderProductCurrency
    ) {
        this.amount = amount
        this.currency = currency
    }

    get Amount(): number {
        return this.amount.Monto
    }

    get Currency(): string {
        return this.currency.Currency
    }

    equals(valueObject: OrderProductPrice): boolean {
        return (this.amount.Monto === valueObject.amount.Monto)
            && (this.currency.Currency === valueObject.currency.Currency);
    }

    static create(amount: OrderProductAmount, currency: OrderProductCurrency): OrderProductPrice {
        return new OrderProductPrice(amount, currency)
    }
}