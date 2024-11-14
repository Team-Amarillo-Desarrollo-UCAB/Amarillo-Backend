import { DomainEvent } from "src/common/domain/domain-event/domain-event.interface";
import { EnumOrderEstados } from "../order-estados-enum";
import { OrderDetail } from "../entites/order-detail";

export class OrderCreated extends DomainEvent {
    protected constructor(
        public id: string,
        public estado: EnumOrderEstados,
        public fecha_creacion: Date,
        public montoTotal: number,
        public detalles: OrderDetail[]
    ) {
        super();
    }

    public static create(
        id: string,
        estado: EnumOrderEstados,
        fecha_creacion: Date,
        montoTotal: number,
        detalles: OrderDetail[]
    ): OrderCreated {
        return new OrderCreated(
            id,
            estado,
            fecha_creacion,
            montoTotal,
            detalles
        );
    }
}