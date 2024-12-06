import { IValueObject } from "src/common/domain/value-object/value-object.interface";

export class OrderPaymentCurrency implements IValueObject<OrderPaymentCurrency> {
    // Sera "$" o "USD"
    private readonly currency: string;

    protected constructor(currency: string) {
        this.currency = currency
    }

    get Currency(): string {
        return this.currency
    }

    equals(valueObject: OrderPaymentCurrency): boolean {
        return this.currency === valueObject.Currency
    }

    static create(currency: string): OrderPaymentCurrency {
        return new OrderPaymentCurrency(currency);
    }

}