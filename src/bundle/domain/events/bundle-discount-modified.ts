import { DomainEvent } from "src/common/domain/domain-event/domain-event.interface";

export class BundleDiscountModified extends DomainEvent {
    protected constructor(
        public id: string,
        public discount: string
    ) {
        super();
    }

    static create(id: string, discount: string): BundleDiscountModified {
        return new BundleDiscountModified(id, discount);
    }
}
