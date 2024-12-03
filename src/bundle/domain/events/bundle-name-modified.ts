import { DomainEvent } from "src/common/domain/domain-event/domain-event.interface";

export class BundleNameModified extends DomainEvent {
    protected constructor(
        public id: string,
        public name: string
    ) {
        super();
    }

    static create(id: string, name: string): BundleNameModified {
        return new BundleNameModified(id, name);
    }
}
