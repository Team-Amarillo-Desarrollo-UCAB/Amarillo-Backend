import { DomainEvent } from "src/common/domain/domain-event/domain-event.interface";
import { EnumOrderEstados } from "../enum/order-estados-enum";
import { OrderProduct } from "../entites/order-product";
import { OrderBundle } from "../entites/order-bundle";
import { OrderLocationDelivery } from "../value-object/order-location-delivery";

export class OrderCreated extends DomainEvent {
    protected constructor(
        public id: string,
        public estado: EnumOrderEstados,
        public fecha_creacion: Date,
        public fecha_entrega: Date,
        public productos: OrderProduct[],
        public bundles: OrderBundle[],
        public ubicacion: OrderLocationDelivery
    ) {
        super();
    }

    public static create(
        id: string,
        estado: EnumOrderEstados,
        fecha_creacion: Date,
        fecha_entrega: Date,
        productos: OrderProduct[],
        bundles: OrderBundle[],
        ubicacion: OrderLocationDelivery
    ): OrderCreated {
        return new OrderCreated(
            id,
            estado,
            fecha_creacion,
            fecha_entrega,
            productos,
            bundles,
            ubicacion
        );
    }
}