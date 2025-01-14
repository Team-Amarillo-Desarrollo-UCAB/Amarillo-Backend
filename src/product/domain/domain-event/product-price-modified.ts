import { DomainEvent } from "src/common/domain/domain-event/domain-event.interface"
import { Moneda } from "../enum/Monedas"

export class ProductPriceModified extends DomainEvent{

    protected constructor(
        public id: string,
        public precio: number,
        public moneda: Moneda
    ){
        super()
    }

    static create(id: string, precio: number, moneda: Moneda){
        return new ProductPriceModified(
            id,
            precio,
            moneda
        )
    }

}