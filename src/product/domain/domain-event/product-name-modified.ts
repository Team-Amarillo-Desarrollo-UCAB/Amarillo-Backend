import { DomainEvent } from "src/common/domain/domain-event/domain-event.interface"

export class ProductNameModified extends DomainEvent{

    protected constructor(
        public id: string,
        public nombre: string
    ){
        super()
    }

    static create(id: string, nombre: string){
        return new ProductNameModified(
            id,
            nombre
        )
    }

}