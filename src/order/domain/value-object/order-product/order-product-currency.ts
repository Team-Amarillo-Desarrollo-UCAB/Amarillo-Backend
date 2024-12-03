import { IValueObject } from "src/common/domain/value-object/value-object.interface";

export class OrderProductCurrency implements IValueObject<OrderProductCurrency> {
    // Sera "$" o "USD"
    private readonly currency: string;

    protected constructor(currency: string) {
        this.currency = currency
    }

    get Currency(): string {
        return this.currency
    }

    equals(valueObject: OrderProductCurrency): boolean {
        return this.currency === valueObject.Currency
    }

    static create(currency: string): OrderProductCurrency {
        return new OrderProductCurrency(currency);
    }

}