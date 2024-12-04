import { DomainEvent } from "src/common/domain/domain-event/domain-event.interface"

export class ProductDescriptionModified extends DomainEvent{

    protected constructor(
        public id: string,
        public descipcion: string
    ){
        super()
    }

    static create(id: string, descipcion: string){
        return new ProductDescriptionModified(
            id,
            descipcion
        )
    }

}