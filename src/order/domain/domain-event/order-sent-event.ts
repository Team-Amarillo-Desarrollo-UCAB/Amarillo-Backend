import { DomainEvent } from "src/common/domain/domain-event/domain-event.interface";
import { OrderId } from "../value-object/order-id";
import { OrderEstado } from "../value-object/order-estado";

export class OrderSent extends DomainEvent {

    protected constructor(
        id: OrderId,
        estado: OrderEstado
    ) {
        super()
    }

    static create(id: OrderId, estado: OrderEstado){
        return new OrderSent(id,estado)
    }

}