import { DomainEvent } from "src/common/domain/domain-event/domain-event.interface";

export class BundleProductsModified extends DomainEvent {
    protected constructor(
        public id: string,
        public productIds: string[]
    ) {
        super();
    }

    static create(id: string, productIds: string[]): BundleProductsModified {
        return new BundleProductsModified(id, productIds);
    }
}
