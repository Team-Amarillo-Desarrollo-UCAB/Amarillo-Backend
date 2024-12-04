import { DomainEvent } from "src/common/domain/domain-event/domain-event.interface";
import { EnumOrderEstados } from "../enum/order-estados-enum";
import { OrderDetail } from "../entites/order-detail";
import { OrderProduct } from "../entites/order-product";

export class OrderCreated extends DomainEvent {
    protected constructor(
        public id: string,
        public estado: EnumOrderEstados,
        public fecha_creacion: Date,
        public productos: OrderProduct[]
    ) {
        super();
    }

    public static create(
        id: string,
        estado: EnumOrderEstados,
        fecha_creacion: Date,
        productos: OrderProduct[]
    ): OrderCreated {
        return new OrderCreated(
            id,
            estado,
            fecha_creacion,
            productos
        );
    }
}