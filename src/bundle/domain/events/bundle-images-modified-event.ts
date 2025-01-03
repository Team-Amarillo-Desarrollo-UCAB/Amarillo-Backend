import { DomainEvent } from "src/common/domain/domain-event/domain-event.interface";

export class BundleImagesModified extends DomainEvent {
    protected constructor(
        public id: string,
        public images: string[]
    ) {
        super();
    }

    static create(id: string, images: string[]): BundleImagesModified {
        return new BundleImagesModified(id, images);
    }
}
