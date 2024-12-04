import { DomainEvent } from "src/common/domain/domain-event/domain-event.interface"

export class ProductPriceModified extends DomainEvent{

    protected constructor(
        public id: string,
        public precio: number,
        public moneda: string
    ){
        super()
    }

    static create(id: string, precio: number, moneda: string){
        return new ProductPriceModified(
            id,
            precio,
            moneda
        )
    }

}