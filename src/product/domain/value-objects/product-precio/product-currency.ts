import { IValueObject } from "src/common/domain/value-object/value-object.interface";
import { Moneda } from "../../enum/Monedas";

export class ProductCurrency implements IValueObject<ProductCurrency> {
    // Sera "$" o "USD"
    private readonly currency: Moneda;

    protected constructor(currency: Moneda) {
        this.currency = currency
    }

    get Currency(): Moneda {
        return this.currency
    }

    equals(valueObject: ProductCurrency): boolean {
        return this.currency === valueObject.Currency
    }

    static create(currency: Moneda): ProductCurrency {
        return new ProductCurrency(currency);
    }

}