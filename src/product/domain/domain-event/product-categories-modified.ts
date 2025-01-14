import { DomainEvent } from "src/common/domain/domain-event/domain-event.interface";

export class ProductCategoryModified extends DomainEvent {
    protected constructor(
        public id: string,
        public category: string[]
    ) {
        super();
    }

    static create(id: string, category: string[]): ProductCategoryModified {
        return new ProductCategoryModified(id, category);
    }
}