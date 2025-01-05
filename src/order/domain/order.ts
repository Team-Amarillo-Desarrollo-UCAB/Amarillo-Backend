import { AggregateRoot } from "src/common/domain/aggregate-root/aggregate-root";
import { DomainEvent } from "src/common/domain/domain-event/domain-event.interface";
import { OrderId } from "./value-object/order-id";
import { EnumOrderEstados } from "./enum/order-estados-enum";
import { OrderEstado } from "./value-object/order-estado";
import { OrderCreationDate } from './value-object/order-fecha-creacion';
import { OrderTotal } from './value-object/order-total';
import { OrderCreated } from "./domain-event/order-created-event";
import { OrderProduct } from "./entites/order-product";
import { OrderPayment } from "./entites/order-payment";
import { OrderTotalCalculated } from "./domain-event/order-amount-calculated";
import { InvalidOrder } from "./domain-exception/invalid-order";
import { OrderBundle } from "./entites/order-bundle";
import { UserId } from "src/user/domain/value-object/user-id";
import { OrderCanceled } from "./domain-event/order-canceled-event";
import { OrderReciviedDate } from "./value-object/order-recivied-date";
import { InvalidOrderState } from "./domain-exception/invalid-order-state";
import { OrderRecivied } from "./domain-event/order-recivied-event";
import { OrderSent } from "./domain-event/order-sent-event";
import { OrderLocationDelivery } from "./value-object/order-location-delivery";
import { OrderReport } from "./entites/order-report";
import { OrderReportCreated } from "./domain-event/order-report-created";
import { OrderDiscount } from "./value-object/order-discount";
import { OrderSubTotal } from "./value-object/order-subtotal";
import { OrderShippingFee } from "./value-object/order-shipping-fee";

export class Order extends AggregateRoot<OrderId> {

    private montoTotal: OrderTotal
    private payment: OrderPayment
    private fecha_entrega?: OrderReciviedDate
    private ubicacion?: OrderLocationDelivery
    private reporte?: OrderReport

    protected constructor(
        id: OrderId,
        private estado: OrderEstado,
        private fecha_creacion: OrderCreationDate,
        private comprador: UserId,
        private productos: OrderProduct[],
        private bundles: OrderBundle[],
        fecha_entrega?: OrderReciviedDate,
        ubicacion?: OrderLocationDelivery,
        montoTotal?: OrderTotal,
        reporte?: OrderReport
    ) {

        if ((productos.length === 0) && (bundles.length === 0))
            throw new InvalidOrder("La orden debe contener al menos un producto o un combo")

        if (fecha_entrega.ReciviedDate.getTime() < fecha_creacion.Date_creation.getTime())
            throw new InvalidOrder("La fecha de entrega no puede ser menor al dia actual")

        const event: OrderCreated = OrderCreated.create(
            id.Id,
            estado.Estado,
            fecha_creacion.Date_creation,
            fecha_entrega.ReciviedDate,
            productos,
            bundles,
            ubicacion
        )

        super(id, event)

        montoTotal ? this.montoTotal = montoTotal : this.montoTotal = null
        fecha_entrega ? this.fecha_entrega = fecha_entrega : null
        ubicacion ? this.ubicacion = ubicacion : null
        reporte ? this.reporte = reporte : null
    }

    get Estado() {
        return this.estado
    }

    get Fecha_creacion() {
        return this.fecha_creacion
    }

    get Fecha_entrega() {
        return this.fecha_creacion
    }

    get Monto() {
        return this.montoTotal
    }

    get Productos(): OrderProduct[] {
        return this.productos
    }

    get Bundles(): OrderBundle[] {
        return this.bundles
    }

    get Moneda() {
        return this.montoTotal.Currency
    }

    get Payment() {
        return this.payment
    }

    get Comprador() {
        return this.comprador
    }

    get Direccion() {
        return this.ubicacion
    }

    get Reporte() {
        return this.reporte ? this.reporte : null
    }

    calcularMontoProductos(): number {
        let monto_productos = 0
        for (const p of this.productos) {
            monto_productos += p.Precio().Amount * p.Cantidad().Value
        }
        return monto_productos
    }

    // TODO: Implementación del metodo para cambiar el estado de la orden con sus validaciones
    cambiarEstado(estado: EnumOrderEstados): void {

        if (!this.estado.equals(OrderEstado.create(estado))) {

            if (estado === EnumOrderEstados.EN_CAMINO)
                this.changeStateOrderRecivied()

            if (estado === EnumOrderEstados.ENTREGADA)
                this.chnageStateOrderSent()

            if (estado === EnumOrderEstados.CANCELED)
                this.cancelarOrden()
        }
    }

    private changeStateOrderRecivied(): void {
        if (this.estado.equals(OrderEstado.create(EnumOrderEstados.CANCELED)))
            throw new InvalidOrderState('La orden no se puede cambiar si ya fue cancelada')
        this.estado = OrderEstado.create(EnumOrderEstados.ENTREGADA)
        this.events.push(
            OrderRecivied.create(
                this.Id,
                this.estado
            )
        )
    }

    private chnageStateOrderSent(): void {
        if (this.estado.equals(OrderEstado.create(EnumOrderEstados.CANCELED)))
            throw new InvalidOrderState('La orden no se puede cambiar si ya fue cancelada')
        this.estado = OrderEstado.create(EnumOrderEstados.EN_CAMINO)
        this.events.push(
            OrderSent.create(
                this.Id,
                this.estado
            )
        )
    }

    cancelarOrden() {
        if (this.estado.equals(OrderEstado.create(EnumOrderEstados.EN_CAMINO)))
            throw new InvalidOrderState('La orden no se puede cancelar debido a que esta en camino')

        this.estado = OrderEstado.create(EnumOrderEstados.CANCELED)
        this.events.push(
            OrderCanceled.create(
                this.Id,
                this.estado
            )
        )
    }

    assignOrderReport(report: OrderReport): void {
        const evento = OrderReportCreated.create(
            this.Id.Id,
            report.Id.Id,
            report.Texto().Texto
        )
        this.reporte = report
        this.events.push(evento)
    }

    assignOrderCost(monto: OrderTotal): void {
        this.onEvent(OrderTotalCalculated.create(
            this.Id.Id,
            monto.Total,
            monto.SubTotal.Value,
            monto.Currency,
            monto.Discount.Value,
            monto.ShippingFee.Value
        ))
    }

    asignarMetodoPago(payment: OrderPayment): void {
        this.payment = payment
    }

    protected applyEvent(event: DomainEvent): void {
        switch (event.eventName) {
            //patron estado o estrategia, esto es una cochinada el switch case
            case 'OrderCreated':
                const orderCreated: OrderCreated = event as OrderCreated;
                this.estado = OrderEstado.create(orderCreated.estado)
                this.fecha_creacion = OrderCreationDate.create(orderCreated.fecha_creacion)
                this.productos = orderCreated.productos
                this.bundles = orderCreated.bundles
                break;
            case 'OrderTotalCalculated':
                const orderTotalCalculated = event as OrderTotalCalculated
                this.montoTotal = OrderTotal.create(
                    orderTotalCalculated.total,
                    orderTotalCalculated.moneda,
                    OrderDiscount.create(orderTotalCalculated.descuento),
                    OrderSubTotal.create(orderTotalCalculated.subTotal),
                    OrderShippingFee.create(orderTotalCalculated.shippingFee)
                )
                break;
        }
    }

    protected ensureValidState(): void {
        if (
            !this.estado ||
            !this.fecha_creacion
        )
            throw new InvalidOrder('La orden tiene que ser valida');

        if (
            (this.productos.length === 0) &&
            (this.bundles.length === 0)
        )
            throw new InvalidOrder("La orden debe contener al menos un producto o un combo")
    }

    static create(
        id: OrderId,
        estado: OrderEstado,
        fecha_creacion: OrderCreationDate,
        fecha_entrega: OrderReciviedDate,
        ubicacion: OrderLocationDelivery,
        productos: OrderProduct[],
        bundles: OrderBundle[],
        userId?: UserId,
        montoTotal?: OrderTotal
    ): Order {

        return new Order(
            id,
            estado,
            fecha_creacion,
            userId,
            productos,
            bundles,
            fecha_entrega,
            ubicacion,
            montoTotal ? montoTotal : null
        )
    }

    static createWithReport(
        id: OrderId,
        estado: OrderEstado,
        fecha_creacion: OrderCreationDate,
        fecha_entrega: OrderReciviedDate,
        ubicacion: OrderLocationDelivery,
        productos: OrderProduct[],
        bundles: OrderBundle[],
        reporte: OrderReport,
        userId?: UserId,
        montoTotal?: OrderTotal
    ): Order {

        return new Order(
            id,
            estado,
            fecha_creacion,
            userId,
            productos,
            bundles,
            fecha_entrega,
            ubicacion,
            montoTotal ? montoTotal : null,
            reporte
        )
    }

}