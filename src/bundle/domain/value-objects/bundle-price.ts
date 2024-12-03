import { IValueObject } from "src/common/domain/value-object/value-object.interface";
import { BundleCurrency } from "../enum/bundle-currency-enum";
import { InvalidBundlePriceException } from "../exceptions/invalid-bundle-price.exception";

export class BundlePrice implements IValueObject<BundlePrice> {
    private price: number;
    private currency: BundleCurrency;

    protected constructor(price: number, currency: BundleCurrency) {
        if (price <= 0) {
            throw new InvalidBundlePriceException("El precio debe ser mayor a 0");
        }

        if (!currency /*|| !Object.values(BundleCurrency).includes(currency)*/) {
            throw new InvalidBundlePriceException("La moneda no es válida");
        }

        this.price = price;
        this.currency = currency;
    }

    get Currency(): BundleCurrency {
        return this.currency;
    }

    get Price(): number{
        return this.price
    }

    equals(valueObject: BundlePrice): boolean {
        return (
            this.price === valueObject.price &&
            this.currency === valueObject.currency
        );
    }

    static create(price: number, currency: BundleCurrency): BundlePrice {
        return new BundlePrice(price, currency);
    }
}
