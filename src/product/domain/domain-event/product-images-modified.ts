import { DomainEvent } from "src/common/domain/domain-event/domain-event.interface";

export class ProductImagesModified extends DomainEvent {
    protected constructor(
        public id: string,
        public images: string[]
    ) {
        super();
    }

    static create(id: string, images: string[]): ProductImagesModified {
        return new ProductImagesModified(id, images);
    }
}