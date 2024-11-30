import { DomainEvent } from "src/common/domain/domain-event/domain-event.interface";
import { BundleCurrency } from "../enum/bundle-currency-enum";

export class BundlePriceModified extends DomainEvent {
    protected constructor(
        public id: string,
        public price: number,
        public currency: BundleCurrency
    ) {
        super();
    }

    static create(id: string, price: number,currency:BundleCurrency): BundlePriceModified {
        return new BundlePriceModified(id, price,currency);
    }
}
