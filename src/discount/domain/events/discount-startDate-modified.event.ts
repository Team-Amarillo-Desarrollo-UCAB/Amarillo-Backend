import { DomainEvent } from "src/common/domain/domain-event/domain-event.interface";

export class DiscountStartDateModified extends DomainEvent {
    protected constructor(
        public id: string,
        public date:Date
    ) {
        super();
    }

    static create(id: string, date:Date): DiscountStartDateModified {
        return new DiscountStartDateModified(id, date);
    }
}
