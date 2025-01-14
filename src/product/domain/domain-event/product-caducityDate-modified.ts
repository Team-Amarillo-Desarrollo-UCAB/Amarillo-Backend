import { DomainEvent } from "src/common/domain/domain-event/domain-event.interface";

export class ProductCaducityDateModified extends DomainEvent {
    protected constructor(
        public id: string,
        public date:Date
    ) {
        super();
    }

    static create(id: string, date:Date): ProductCaducityDateModified {
        return new ProductCaducityDateModified(id, date);
    }
}