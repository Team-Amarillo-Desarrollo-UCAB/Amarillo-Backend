import { DomainEvent } from "src/common/domain/domain-event/domain-event.interface";

export class BundleCategoryModified extends DomainEvent {
    protected constructor(
        public id: string,
        public category: { id: string }[]
    ) {
        super();
    }

    static create(id: string, category: { id: string }[]): BundleCategoryModified {
        return new BundleCategoryModified(id, category);
    }
}