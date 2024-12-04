import { DomainEvent } from "src/common/domain/domain-event/domain-event.interface";

export class BundleDescriptionModified extends DomainEvent {
    protected constructor(
        public id: string,
        public description: string
    ) {
        super();
    }

    static create(id: string, description: string): BundleDescriptionModified {
        return new BundleDescriptionModified(id, description);
    }
}
