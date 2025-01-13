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
        public productos: OrderProduct[],
        public bundles: OrderBundle[],
        public ubicacion: OrderLocationDelivery,
        public fecha_entrega?: Date,
    ) {
        super();
    }

    public static create(
        id: string,
        estado: EnumOrderEstados,
        fecha_creacion: Date,
        productos: OrderProduct[],
        bundles: OrderBundle[],
        ubicacion: OrderLocationDelivery,
        fecha_entrega?: Date,
    ): OrderCreated {
        return new OrderCreated(
            id,
            estado,
            fecha_creacion,
            productos,
            bundles,
            ubicacion,
            fecha_entrega
        );
    }
}