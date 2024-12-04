import { DomainEvent } from "src/common/domain/domain-event/domain-event.interface";

export class BundleStockModified extends DomainEvent {
    protected constructor(
        public id: string,
        public stock: number
    ) {
        super();
    }

    static create(id: string, stock: number): BundleStockModified {
        return new BundleStockModified(id, stock);
    }
}
