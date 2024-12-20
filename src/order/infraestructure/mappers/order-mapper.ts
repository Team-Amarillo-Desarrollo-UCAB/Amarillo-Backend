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

export class OrderMapper implements IMapper<Order, OrmOrder> {

    private readonly idGenerator: IdGenerator<string>

    constructor(
        idGenerator: IdGenerator<string>
    ) {
        this.idGenerator = idGenerator
    }

    async fromDomainToPersistence(domain: Order): Promise<OrmOrder> {

        let ormDetalles: Detalle_Orden[] = []

        for (const producto of domain.Productos) {
            ormDetalles.push(
                Detalle_Orden.create(
                    await this.idGenerator.generateId(),
                    producto.Cantidad().Value,
                    domain.Id.Id,
                    producto.Id.Id,
                )
            )
        }

        const order = OrmOrder.create(
            domain.Id.Id,
            domain.Fecha_creacion.Date_creation,
            domain.Monto.Total,
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
        let moneda: string = null
        let precio: number = null
        for (const detalle of persistence.detalles) {
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
                            OrderProductAmount.create(precio ? precio : 5),
                            OrderProductCurrency.create(moneda ? moneda : '$')
                        )
                    )
                )
            }
        }

        const orderEstado = persistence.detalles.length === 0
            ? OrderEstado.create(EnumOrderEstados.CREATED)
            : estado ? OrderEstado.create(estado.estado.nombre) : OrderEstado.create(EnumOrderEstados.CREATED)

        console.log(orderEstado)


        console.log("Orden para transformar: ",persistence)

        const order = Order.create(
            OrderId.create(persistence.id),
            orderEstado,
            OrderCreationDate.create(persistence.fecha_creacion),
            productos,
            OrderTotal.create(persistence.monto_total),
        )

        order.assignOrderCost(persistence.monto_total)

        console.log("Orden transformada: ",order)

        return order

    }


}