import { DomainEvent } from "src/common/domain/domain-event/domain-event.interface";

export class DiscountDescriptionModified extends DomainEvent {
    protected constructor(
        public id: string,
        public description: string
    ) {
        super();
    }

    static create(id: string, description: string): DiscountDescriptionModified {
        return new DiscountDescriptionModified(id, description);
    }
}
