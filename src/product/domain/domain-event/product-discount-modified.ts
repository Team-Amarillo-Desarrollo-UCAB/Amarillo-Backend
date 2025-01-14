import { DomainEvent } from "src/common/domain/domain-event/domain-event.interface";

export class ProductDiscountModified extends DomainEvent {
    protected constructor(
        public id: string,
        public discount: string
    ) {
        super();
    }

    static create(id: string, discount: string): ProductDiscountModified {
        return new ProductDiscountModified(id, discount);
    }
}