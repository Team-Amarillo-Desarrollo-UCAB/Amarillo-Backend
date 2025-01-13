import { Order } from "src/order/domain/order";
import { OrmOrder } from "../entites/order.entity"
import { IMapper } from "src/common/application/mappers/mapper.interface"
import { Detalle_Orden } from '../entites/detalle_orden.entity';
import { OrderId } from "src/order/domain/value-object/order-id";
import { OrderEstado } from "src/order/domain/value-object/order-estado";
import { Estado_Orden } from "../entites/Estado-orden/estado_orden.entity";
import { OrderCreationDate } from "src/order/domain/value-object/order-fecha-creacion";
import { OrderTotal } from "src/order/domain/value-object/order-total";
import { ProductId } from "src/product/domain/value-objects/product-id";
import { EnumOrderEstados } from "src/order/domain/enum/order-estados-enum";
import { IdGenerator } from "src/common/application/id-generator/id-generator.interface";
import { OrderProduct } from "src/order/domain/entites/order-product";
import { OrderProductName } from "src/order/domain/value-object/order-product/order-product-name";
import { OrderProductCantidad } from "src/order/domain/value-object/order-product/order-product-cantidad";
import { OrderProductPrice } from "src/order/domain/value-object/order-product/order-product-price";
import { OrderProductAmount } from "src/order/domain/value-object/order-product/order-product-amount";
import { OrderProductCurrency } from "src/order/domain/value-object/order-product/order-product-currency";
import { HistoricoPrecio } from "src/product/infraestructure/entities/historico-precio.entity";
import { OrderBundle } from "src/order/domain/entites/order-bundle";
import { BundleID } from "src/bundle/domain/value-objects/bundle-id";
import { OrderBundleName } from "src/order/domain/value-object/order-bundle/order-bundle-name";
import { OrderBundleCantidad } from "src/order/domain/value-object/order-bundle/order-bundle-cantidad";
import { OrderBundlePrice } from "src/order/domain/value-object/order-bundle/order-bundle-price";
import { OrderBundleAmount } from "src/order/domain/value-object/order-bundle/order-bundle-amount";
import { OrderBundleCurrency } from "src/order/domain/value-object/order-bundle/order-bundle-currency";
import { UserId } from "src/user/domain/value-object/user-id";
import { Moneda } from "src/product/domain/enum/Monedas";
import { Payment } from "../entites/payment.entity";
import { OrderPayment } from "src/order/domain/entites/order-payment";
import { OrderReciviedDate } from "src/order/domain/value-object/order-recivied-date";
import { OrderLocationDelivery } from "src/order/domain/value-object/order-location-delivery";
import { OrderReport } from "src/order/domain/entites/order-report";
import { OrderReportId } from "src/order/domain/value-object/order-report/order-report-id";
import { OrderReportText } from "src/order/domain/value-object/order-report/order-report-text";
import { OrderDiscount } from "src/order/domain/value-object/order-discount";
import { OrderSubTotal } from "src/order/domain/value-object/order-subtotal";
import { OrderShippingFee } from "src/order/domain/value-object/order-shipping-fee";
import { OrderInstructions } from "src/order/domain/value-object/order-instructions";

export class OrderMapper implements IMapper<Order, OrmOrder> {

    private readonly idGenerator: IdGenerator<string>
    private readonly paymentMapper: IMapper<OrderPayment, Payment>

    constructor(
        idGenerator: IdGenerator<string>,
        paymentMapper: IMapper<OrderPayment, Payment>
    ) {
        this.idGenerator = idGenerator
        this.paymentMapper = paymentMapper
    }

    async fromDomainToPersistence(domain: Order): Promise<OrmOrder> {

        let ormDetalles: Detalle_Orden[] = []

        if (domain.Productos.length > 0) {
            for (const producto of domain.Productos) {
                ormDetalles.push(
                    Detalle_Orden.create(
                        await this.idGenerator.generateId(),
                        producto.Cantidad().Value,
                        producto.Precio().Amount,
                        domain.Id.Id,
                        producto.Id.Id,
                        null
                    )
                )
            }
        }

        console.log("Combos de la orden: ", domain.Bundles)

        if (domain.Bundles.length > 0) {
            for (const combo of domain.Bundles) {
                ormDetalles.push(
                    Detalle_Orden.create(
                        await this.idGenerator.generateId(),
                        combo.Cantidad().Value,
                        combo.Precio().Amount,
                        domain.Id.Id,
                        null,
                        combo.Id.Value
                    )
                )
            }
        }

        const order = OrmOrder.createWithUser(
            domain.Id.Id,
            domain.Fecha_creacion.Date_creation,
            domain.Direccion.Longitud,
            domain.Direccion.Latitud,
            domain.Direccion.Direccion,
            domain.Monto.Total,
            domain.Monto.SubTotal.Value,
            domain.Monto.Discount.Value,
            domain.Monto.ShippingFee.Value,
            domain.Comprador.Id,
            domain.Fecha_entrega ? domain.Fecha_entrega.ReciviedDate : null,
            domain.Instruction ? domain.Instruction.Value : null,
            ormDetalles,
            undefined,
            await this.paymentMapper.fromDomainToPersistence(domain.Payment)
        )

        return order

    }

    async fromPersistenceToDomain(persistence: OrmOrder): Promise<Order> {

        let estado: Estado_Orden

        for (const p of persistence.estados) {
            if (p.fecha_fin === null) {
                estado = p
            }
        }

        let productos: OrderProduct[] = []
        let combos: OrderBundle[] = []
        let currency: Moneda

        for (const detalle of persistence.detalles) {

            console.log("Detalle a mappear: ", detalle)

            if (detalle.producto) {


                productos.push(
                    OrderProduct.create(
                        ProductId.create(detalle.id_producto),
                        OrderProductName.create(detalle.producto.name),
                        OrderProductCantidad.create(detalle.cantidad),
                        OrderProductPrice.create(
                            OrderProductAmount.create(detalle.producto.price),
                            OrderProductCurrency.create(detalle.producto.currency)
                        )
                    )
                )
            }

            if (detalle.combos) {

                combos.push(
                    OrderBundle.create(
                        BundleID.create(detalle.combos.id),
                        OrderBundleName.create(detalle.combos.name),
                        OrderBundleCantidad.create(detalle.cantidad),
                        OrderBundlePrice.create(
                            OrderBundleAmount.create(detalle.combos.price),
                            OrderBundleCurrency.create(detalle.combos.currency)
                        )
                    )
                )

            }
        }

        const orderEstado = persistence.detalles.length === 0
            ? OrderEstado.create(EnumOrderEstados.CREATED)
            : estado ? OrderEstado.create(estado.estado.nombre) : OrderEstado.create(EnumOrderEstados.CREATED)

        console.log(orderEstado)

        persistence.pago ? currency = persistence.pago.moneda : null

        if (persistence.reporte && persistence.reporte !== null) {
            const order = Order.createWithReport(
                OrderId.create(persistence.id),
                orderEstado,
                OrderCreationDate.create(persistence.fecha_creacion),
                OrderLocationDelivery.create(
                    persistence.ubicacion,
                    persistence.longitud,
                    persistence.latitud
                ),
                productos,
                combos,
                OrderReport.create(
                    OrderReportId.create(persistence.reporte.id),
                    OrderReportText.create(persistence.reporte.texto)
                ),
                persistence.fecha_entrega ? OrderReciviedDate.create(persistence.fecha_entrega) : null,
                persistence.id_user ? UserId.create(persistence.id_user) : null,
                persistence.instruccion ? OrderInstructions.create(persistence.instruccion) : null,
                OrderTotal.create(
                    persistence.monto_total,
                    persistence.pago.moneda,
                    OrderDiscount.create(persistence.descuento),
                    OrderSubTotal.create(persistence.subTotal),
                    OrderShippingFee.create(persistence.shipping_fee)
                )
            )
            order.asignarMetodoPago(await this.paymentMapper.fromPersistenceToDomain(persistence.pago))
            order.pullEvents()
            console.log("Orden transformada: ", order)

            return order
        }

        const order = Order.create(
            OrderId.create(persistence.id),
            orderEstado,
            OrderCreationDate.create(persistence.fecha_creacion),
            OrderLocationDelivery.create(
                persistence.ubicacion,
                persistence.longitud,
                persistence.latitud
            ),
            productos,
            combos,
            persistence.fecha_entrega ? OrderReciviedDate.create(persistence.fecha_entrega) : null,
            persistence.id_user ? UserId.create(persistence.id_user) : null,
            persistence.instruccion ? OrderInstructions.create(persistence.instruccion) : null,
            OrderTotal.create(
                persistence.monto_total,
                persistence.pago.moneda,
                OrderDiscount.create(persistence.descuento),
                OrderSubTotal.create(persistence.subTotal),
                OrderShippingFee.create(persistence.shipping_fee)
            ),
        )
        order.asignarMetodoPago(await this.paymentMapper.fromPersistenceToDomain(persistence.pago))
        order.pullEvents()

        return order

    }


}