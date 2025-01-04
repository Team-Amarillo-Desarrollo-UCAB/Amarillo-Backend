import { DomainEvent } from "src/common/domain/domain-event/domain-event.interface";

export class DiscountImageModified extends DomainEvent {
    protected constructor(
        public id: string,
        public image: string
    ) {
        super();
    }

    static create(id: string, image: string): DiscountImageModified {
        return new DiscountImageModified(id, image);
    }
}
