import { IValueObject } from "src/common/domain/value-object/value-object.interface";

export class OrderBundleCurrency implements IValueObject<OrderBundleCurrency> {
    // Sera "$" o "USD"
    private readonly currency: string;

    protected constructor(currency: string) {
        this.currency = currency
    }

    get Currency(): string {
        return this.currency
    }

    equals(valueObject: OrderBundleCurrency): boolean {
        return this.currency === valueObject.Currency
    }

    static create(currency: string): OrderBundleCurrency {
        return new OrderBundleCurrency(currency);
    }

}