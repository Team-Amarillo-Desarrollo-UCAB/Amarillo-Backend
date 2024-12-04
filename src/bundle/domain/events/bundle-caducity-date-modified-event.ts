import { DomainEvent } from "src/common/domain/domain-event/domain-event.interface";

export class BundleCaducityDateModified extends DomainEvent {
    protected constructor(
        public id: string,
        public date:Date
    ) {
        super();
    }

    static create(id: string, date:Date): BundleCaducityDateModified {
        return new BundleCaducityDateModified(id, date);
    }
}
