import { DomainEvent } from "src/common/domain/domain-event/domain-event.interface";

export class DiscountPercentageModified extends DomainEvent {
    protected constructor(
        public id: string,
        public percentage: number,
    ) {
        super();
    }

    static create(id: string, percentage: number): DiscountPercentageModified {
        return new DiscountPercentageModified(id, percentage);
    }
}
