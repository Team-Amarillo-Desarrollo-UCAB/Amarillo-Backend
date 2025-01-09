import { DomainEvent } from "src/common/domain/domain-event/domain-event.interface";
import { EnumOrderEstados } from "../enum/order-estados-enum";

export class OrderStateChanged extends DomainEvent {

    protected constructor(
        public id: string,
        public estado: EnumOrderEstados
    ) {
        super()
    }

    static create(id: string, estado: EnumOrderEstados){
        return new OrderStateChanged(id,estado)
    }

}