import { AggregateRoot } from "src/common/domain/aggregate-root/aggregate-root";
import { DomainEvent } from "src/common/domain/domain-event/domain-event.interface";
import { OrderId } from "./value-object/order-id";
import { EnumOrderEstados } from "./order-estados-enum";
import { OrderEstado } from "./value-object/order-estado";
import { OrderCreationDate } from './value-object/order-fecha-creacion';
import { OrderTotal } from './value-object/order-total';
import { OrderDetail } from "./entites/order-detail";
import { OrderCreated } from "./domain-event/order-created-event";

export class Order extends AggregateRoot<OrderId> {

    // TODO: Se creara el servicio de dominio para calcular el shipping fee y el monto total
    // TODO: Agregar la referencia al usuario?
    protected constructor(
        id: OrderId,
        private estado: OrderEstado,
        private fecha_creacion: OrderCreationDate,
        private montoTotal: OrderTotal,
        private detalles: OrderDetail[],
    ) {

        const event = OrderCreated.create(
            id.Id,
            estado.Estado,
            fecha_creacion.Date_creation,
            montoTotal.Total,
            detalles
        )

        super(id, event)
    }

    get Estado() {
        return this.estado.Estado
    }

    get Fecha_creacion() {
        return this.fecha_creacion.Date_creation
    }

    get Monto() {
        return this.montoTotal.Total
    }

    get Detalles() {
        return this.detalles
    }

    // TODO: Implementación del metodo para cambiar el estado de la orden con sus validaciones
    cambiarEstado(estado: EnumOrderEstados): void {

    }

    protected applyEvent(event: DomainEvent): void {
        switch (event.eventName) {
            //patron estado o estrategia, esto es una cochinada el switch case
            case 'OrderCreated':
                const orderCreated: OrderCreated = event as OrderCreated;
                this.estado = OrderEstado.create(orderCreated.estado)
                this.fecha_creacion = OrderCreationDate.create(orderCreated.fecha_creacion)
                this.montoTotal = OrderTotal.create(orderCreated.montoTotal)
                this.detalles = orderCreated.detalles
                break;
        }
    }

    protected ensureValidState(): void {
        if (
            !this.estado ||
            !this.fecha_creacion ||
            !this.montoTotal ||
            !this.detalles
        )
        throw new Error('La orden tiene que ser valida');
    }

    static create(
        id: OrderId,
        estado: OrderEstado,
        fecha_creacion: OrderCreationDate,
        montoTotal: OrderTotal,
        detalles: OrderDetail[],
    ): Order{
        return new Order(
            id,
            estado,
            fecha_creacion,
            montoTotal,
            detalles
        )
    }

}