import { DomainEvent } from "src/common/domain/domain-event/domain-event.interface";
import { OrderId } from "../value-object/order-id";
import { EnumOrderEstados } from "../enum/order-estados-enum";

export class OrderSent extends DomainEvent {

    protected constructor(
        public id: string,
        public estado: EnumOrderEstados
    ) {
        super()
    }

    static create(id: string, estado: EnumOrderEstados){
        return new OrderSent(id,estado)
    }

}