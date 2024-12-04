import { DomainEvent } from "src/common/domain/domain-event/domain-event.interface";

export class ProductStockModified extends DomainEvent{

    protected constructor(
        public id: string,
        public stock: number
    ){
        super()
    }

    static create(id: string, stock: number){
        return new ProductStockModified(
            id,
            stock
        )
    }

}