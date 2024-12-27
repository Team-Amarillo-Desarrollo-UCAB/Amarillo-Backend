import { IValueObject } from "src/common/domain/value-object/value-object.interface";
import { OrderBundleAmount } from './order-bundle-amount';
import { OrderBundleCurrency } from "./order-bundle-currency";

export class OrderBundlePrice implements IValueObject<OrderBundlePrice> {

    private readonly amount: OrderBundleAmount
    private readonly currency: OrderBundleCurrency

    protected constructor(
        amount: OrderBundleAmount,
        currency: OrderBundleCurrency
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

    equals(valueObject: OrderBundlePrice): boolean {
        return (this.amount.Monto === valueObject.amount.Monto)
            && (this.currency.Currency === valueObject.currency.Currency);
    }

    static create(amount: OrderBundleAmount, currency: OrderBundleCurrency): OrderBundlePrice {
        return new OrderBundlePrice(amount, currency)
    }
}