import { IValueObject } from "src/common/domain/value-object/value-object.interface";
import { ProductAmount } from "./product-amount";
import { ProductCurrency } from "./product-currency";

export class ProductPrice implements IValueObject<ProductPrice> {

    private readonly amount: ProductAmount
    private readonly currency: ProductCurrency

    protected constructor(
        amount: ProductAmount,
        currency: ProductCurrency
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

    equals(valueObject: ProductPrice): boolean {
        return (this.amount.Monto === valueObject.amount.Monto)
            && (this.currency.Currency === valueObject.currency.Currency);
    }

    static create(amount: ProductAmount, currency: ProductCurrency): ProductPrice {
        return new ProductPrice(amount, currency)
    }
}