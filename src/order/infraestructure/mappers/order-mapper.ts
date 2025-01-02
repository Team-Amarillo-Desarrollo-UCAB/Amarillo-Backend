import { Order } from "src/order/domain/order";
import { OrmOrder } from "../entites/order.entity"
import { IMapper } from "src/common/application/mappers/mapper.interface"
import { Detalle_Orden } from '../entites/detalle_orden.entity';
import { OrderId } from "src/order/domain/value-object/order-id";
import { OrderEstado } from "src/order/domain/value-object/order-estado";
import { Estado_Orden } from "../entites/Estado-orden/estado_orden.entity";
import { OrderCreationDate } from "src/order/domain/value-object/order-fecha-creacion";
import { OrderTotal } from "src/order/domain/value-object/order-total";
import { OrderDetail } from "src/order/domain/entites/order-detail";
import { OrderDetalleId } from "src/order/domain/value-object/order-detalle.ts/order-detalle-id";
import { ProductId } from "src/product/domain/value-objects/product-id";
import { OrderDetalleCantidad } from "src/order/domain/value-object/order-detalle.ts/order-detalle-cantidad";
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

export class OrderMapper implements IMapper<Order, OrmOrder> {

    private readonly idGenerator: IdGenerator<string>

    constructor(
        idGenerator: IdGenerator<string>
    ) {
        this.idGenerator = idGenerator
    }

    async fromDomainToPersistence(domain: Order): Promise<OrmOrder> {

        let ormDetalles: Detalle_Orden[] = []

        if (domain.Productos.length > 0) {
            for (const producto of domain.Productos) {
                ormDetalles.push(
                    Detalle_Orden.create(
                        await this.idGenerator.generateId(),
                        producto.Cantidad().Value,
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
                        domain.Id.Id,
                        null,
                        combo.Id.Value
                    )
                )
            }
        }

        console.log()

        const order = OrmOrder.createWithUser(
            domain.Id.Id,
            domain.Fecha_creacion.Date_creation,
            domain.Monto.Total,
            domain.Comprador.Id,
            ormDetalles
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
        let moneda: string = null
        let precio: number = null

        for (const detalle of persistence.detalles) {

            console.log("Detalle a mappear: ", detalle)

            if (detalle.producto) {

                let producto = detalle.producto

                for (const h of producto.historicos) {
                    if (!h.fecha_fin) {
                        moneda = h.moneda.simbolo
                        precio = h.precio
                        break;
                    }
                }

                productos.push(
                    OrderProduct.create(
                        ProductId.create(detalle.id_producto),
                        OrderProductName.create(detalle.producto.name),
                        OrderProductCantidad.create(detalle.cantidad),
                        OrderProductPrice.create(
                            OrderProductAmount.create(precio),
                            OrderProductCurrency.create(moneda)
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

        console.log("Orden para transformar: ", persistence)

        const order = Order.create(
            OrderId.create(persistence.id),
            orderEstado,
            OrderCreationDate.create(persistence.fecha_creacion),
            productos,
            combos,
            persistence.id_user ? UserId.create(persistence.id_user) : null,
            OrderTotal.create(persistence.monto_total, persistence.pago.moneda),
        )

        order.pullEvents()
        console.log("Orden transformada: ", order)

        return order

    }


}