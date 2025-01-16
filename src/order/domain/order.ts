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
import { OrderInstructions } from "./value-object/order-instructions";
import { OrderReciviedDateModified } from "./domain-event/order-recivied-date-modified-event";
import { OrderProcessed } from "./domain-event/order-processed-event";
import { OrderStateChanged } from "./domain-event/order-state-changed";
import { OrderLocationDeliveryModified } from "./domain-event/order-location-delivery-modified-event";
import { OrderBillRecivied } from "./domain-event/order-bill-recivied";
import { OrderRefunded } from "./domain-event/order-refunded-event";

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
        private instruccion?: OrderInstructions,
        fecha_entrega?: OrderReciviedDate,
        ubicacion?: OrderLocationDelivery,
        montoTotal?: OrderTotal,
        reporte?: OrderReport
    ) {

        if ((productos.length === 0) && (bundles.length === 0))
            throw new InvalidOrder("La orden debe contener al menos un producto o un combo")

        const event: OrderCreated = OrderCreated.create(
            id.Id,
            estado.Estado,
            fecha_creacion.Date_creation,
            productos,
            bundles,
            ubicacion,
            fecha_entrega ? fecha_entrega.ReciviedDate : null
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

    get Fecha_entrega(): OrderReciviedDate {
        return this.fecha_entrega ? this.fecha_entrega : null
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

    get Instruction() {
        return this.instruccion ? this.instruccion : null
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

            if (estado === EnumOrderEstados.BEING_PROCESSED)
                this.changeStateOrderProcessed()

            if (estado === EnumOrderEstados.EN_CAMINO || estado === EnumOrderEstados.SHIPPED)
                this.chnageStateOrderSent()

            if (estado === EnumOrderEstados.ENTREGADA || estado === EnumOrderEstados.DELIVERED)
                this.changeStateOrderRecivied()

            if (estado === EnumOrderEstados.CANCELLED)
                this.cancelarOrden()
        }
    }

    private changeStateOrderProcessed(): void {
        if (this.estado.equals(OrderEstado.create(EnumOrderEstados.CANCELLED)))
            throw new InvalidOrderState('La orden no se puede cambiar si ya fue cancelada')
        this.estado = OrderEstado.create(EnumOrderEstados.BEING_PROCESSED)
        this.events.push(
            OrderStateChanged.create(
                this.Id.Id,
                this.estado.Estado
            )
        )
    }

    private changeStateOrderRecivied(): void {
        if (this.estado.equals(OrderEstado.create(EnumOrderEstados.CANCELLED)))
            throw new InvalidOrderState('La orden no se puede cambiar si ya fue cancelada')
        this.estado = OrderEstado.create(EnumOrderEstados.DELIVERED)
        this.events.push(
            OrderStateChanged.create(
                this.Id.Id,
                this.estado.Estado
            )
        )
    }

    private chnageStateOrderSent(): void {
        if (this.estado.equals(OrderEstado.create(EnumOrderEstados.CANCELLED)))
            throw new InvalidOrderState('La orden no se puede cambiar si ya fue cancelada')
        this.estado = OrderEstado.create(EnumOrderEstados.SHIPPED)
        this.events.push(
            OrderStateChanged.create(
                this.Id.Id,
                this.estado.Estado
            )
        )
    }

    private cancelarOrden() {
        if (!this.estado.equals(OrderEstado.create(EnumOrderEstados.CREATED)))
            throw new InvalidOrderState('La orden no se puede cancelar debido a que no esta en estado creada')

        this.estado = OrderEstado.create(EnumOrderEstados.CANCELLED)
        this.events.push(
            OrderStateChanged.create(
                this.Id.Id,
                this.estado.Estado
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

    asignarMetodoPago(payment: OrderPayment, bill?: string): void {
        this.payment = payment
        if (bill) {
            this.events.push(OrderBillRecivied.create(this.Id.Id, bill))
        }

    }

    modifiedLocationDelivery(direccion: OrderLocationDelivery): void {
        const event = OrderLocationDeliveryModified.create(
            this.Id.Id,
            direccion.Longitud,
            direccion.Latitud,
            direccion.Direccion
        )
        this.onEvent(event)
    }

    modifiedReciviedDate(frecha_entrega: OrderReciviedDate): void {
        const event = OrderReciviedDateModified.create(this.Id.Id, frecha_entrega.ReciviedDate)
        this.onEvent(event)
    }

    refundOrderEvent(monto: OrderPayment, factura: string): void{
        const event = OrderRefunded.create(
            this.Id.Id,
            monto.AmountPayment().Total,
            monto.CurrencyPayment().Currency,
            factura
        )
        this.events.push(event)
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
            case 'OrderReciviedDateModified':
                const evento = event as OrderReciviedDateModified
                this.fecha_entrega = OrderReciviedDate.create(evento.fecha_entrega)
                break;
            case 'OrderLocationDeliveryModified':
                const orderLocationDeliveryModified = event as OrderLocationDeliveryModified
                this.ubicacion = OrderLocationDelivery.create(
                    orderLocationDeliveryModified.ubicacion,
                    orderLocationDeliveryModified.longitud,
                    orderLocationDeliveryModified.latitud
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
        ubicacion: OrderLocationDelivery,
        productos: OrderProduct[],
        bundles: OrderBundle[],
        fecha_entrega?: OrderReciviedDate,
        userId?: UserId,
        instruccion?: OrderInstructions,
        montoTotal?: OrderTotal
    ): Order {

        return new Order(
            id,
            estado,
            fecha_creacion,
            userId,
            productos,
            bundles,
            instruccion,
            fecha_entrega,
            ubicacion,
            montoTotal ? montoTotal : null
        )
    }

    static createWithReport(
        id: OrderId,
        estado: OrderEstado,
        fecha_creacion: OrderCreationDate,
        ubicacion: OrderLocationDelivery,
        productos: OrderProduct[],
        bundles: OrderBundle[],
        reporte: OrderReport,
        fecha_entrega?: OrderReciviedDate,
        userId?: UserId,
        instruccion?: OrderInstructions,
        montoTotal?: OrderTotal
    ): Order {

        return new Order(
            id,
            estado,
            fecha_creacion,
            userId,
            productos,
            bundles,
            instruccion,
            fecha_entrega ? fecha_entrega : null,
            ubicacion,
            montoTotal ? montoTotal : null,
            reporte
        )
    }

}