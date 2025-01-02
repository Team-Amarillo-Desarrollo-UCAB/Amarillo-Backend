import { DomainEvent } from "src/common/domain/domain-event/domain-event.interface";

export class DiscountDeadlineModified extends DomainEvent {
    protected constructor(
        public id: string,
        public date:Date
    ) {
        super();
    }

    static create(id: string, date:Date): DiscountDeadlineModified {
        return new DiscountDeadlineModified(id, date);
    }
}
