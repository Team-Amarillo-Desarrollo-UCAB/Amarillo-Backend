import { AggregateRoot } from "src/common/domain/aggregate-root/aggregate-root";
import { DomainEvent } from "src/common/domain/domain-event/domain-event.interface";
import { OrderId } from "./value-object/order-id";
import { EnumOrderEstados } from "./enum/order-estados-enum";
import { OrderEstado } from "./value-object/order-estado";
import { OrderCreationDate } from './value-object/order-fecha-creacion';
import { OrderTotal } from './value-object/order-total';
import { OrderDetail } from "./entites/order-detail";
import { OrderCreated } from "./domain-event/order-created-event";
import { OrderProduct } from "./entites/order-product";
import { OrderPayment } from "./entites/order-payment";
import { OrderTotalCalculated } from "./domain-event/order-amount-calculated";
import { InvalidOrder } from "./domain-exception/invalid-order";

export class Order extends AggregateRoot<OrderId> {

    // TODO: Se creara el servicio de dominio para calcular el shipping fee y el monto total
    // TODO: Agregar la referencia al usuario?
    private montoTotal: OrderTotal
    private payment: OrderPayment
    protected constructor(
        id: OrderId,
        private estado: OrderEstado,
        private fecha_creacion: OrderCreationDate,
        private productos: OrderProduct[],
        montoTotal?: OrderTotal,
        //private detalles: OrderDetail[]
    ) {

        const event: OrderCreated = OrderCreated.create(
            id.Id,
            estado.Estado,
            fecha_creacion.Date_creation,
            productos
        )

        super(id, event)

        this.montoTotal = montoTotal
    }

    get Estado() {
        return this.estado
    }

    get Fecha_creacion() {
        return this.fecha_creacion
    }

    get Monto() {
        return this.montoTotal
    }

    get Productos():  OrderProduct[]{
        return this.productos
    }

    get Moneda(){
        return this.productos[0].Moneda()
    }

    get Payment(){
        return this.payment
    }

    calcularMontoProductos(): number{
        let monto_productos = 0
        for (const p of this.productos) {
            monto_productos += p.Precio().Amount * p.Cantidad().Value
        }
        return monto_productos
    }

    // TODO: Implementación del metodo para cambiar el estado de la orden con sus validaciones
    cambiarEstado(estado: EnumOrderEstados): void {
        if(!this.estado.equals(OrderEstado.create(estado))){

            this.estado = OrderEstado.create(estado)

        }
    }

    assignOrderCost(monto: number): void{
        this.onEvent(OrderTotalCalculated.create(this.Id.Id,monto))
    }

    asignarMetodoPago(payment: OrderPayment): void{
        this.payment ? this.payment = payment : null
    }

    protected applyEvent(event: DomainEvent): void {
        switch (event.eventName) {
            //patron estado o estrategia, esto es una cochinada el switch case
            case 'OrderCreated':
                const orderCreated: OrderCreated = event as OrderCreated;
                this.estado = OrderEstado.create(orderCreated.estado)
                this.fecha_creacion = OrderCreationDate.create(orderCreated.fecha_creacion)
                this.productos = orderCreated.productos
                break;
            case 'OrderTotalCalculated':
                const orderTotalCalculated = event as OrderTotalCalculated
                this.montoTotal = OrderTotal.create(orderTotalCalculated.total)
                break;
        }
    }

    protected ensureValidState(): void {
        if (
            !this.estado ||
            !this.fecha_creacion ||
            !this.productos
        )
        throw new InvalidOrder('La orden tiene que ser valida');
    }

    static create(
        id: OrderId,
        estado: OrderEstado,
        fecha_creacion: OrderCreationDate,
        productos: OrderProduct[],
        montoTotal?: OrderTotal
    ): Order{
        return new Order(
            id,
            estado,
            fecha_creacion,
            productos,
            montoTotal ? montoTotal : null
        )
    }

}