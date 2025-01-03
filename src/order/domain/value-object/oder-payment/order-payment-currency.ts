import { IValueObject } from "src/common/domain/value-object/value-object.interface";
import { Moneda } from "src/product/domain/enum/Monedas";

export class OrderPaymentCurrency implements IValueObject<OrderPaymentCurrency> {
    // Sera "$" o "USD"
    private readonly currency: Moneda;

    protected constructor(currency: Moneda) {
        this.currency = currency
    }

    get Currency(): Moneda {
        return this.currency
    }

    equals(valueObject: OrderPaymentCurrency): boolean {
        return this.currency === valueObject.Currency
    }

    static create(currency: Moneda): OrderPaymentCurrency {
        return new OrderPaymentCurrency(currency);
    }

}