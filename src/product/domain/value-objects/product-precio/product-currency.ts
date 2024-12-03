import { IValueObject } from "src/common/domain/value-object/value-object.interface";

export class ProductCurrency implements IValueObject<ProductCurrency> {
    // Sera "$" o "USD"
    private readonly currency: string;

    protected constructor(currency: string) {
        this.currency = currency
    }

    get Currency(): string {
        return this.currency
    }

    equals(valueObject: ProductCurrency): boolean {
        return this.currency === valueObject.Currency
    }

    static create(currency: string): ProductCurrency {
        return new ProductCurrency(currency);
    }

}