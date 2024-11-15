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
import { EnumOrderEstados } from "src/order/domain/order-estados-enum";

export class OrderMapper implements IMapper<Order, OrmOrder> {


    async fromDomainToPersistence(domain: Order): Promise<OrmOrder> {

        const detalles = domain.Detalles
        let ormDetalles: Detalle_Orden[] = []

        for (const detalle of detalles) {
            ormDetalles.push(
                Detalle_Orden.create(
                    detalle.Id.Id,
                    detalle.Cantidad.Cantidad,
                    domain.Id.Id,
                    detalle.ProductoId.Id
                )
            )
        }

        const order = OrmOrder.create(
            domain.Id.Id,
            domain.Fecha_creacion,
            domain.Monto,
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

        let detalles: OrderDetail[] = []
        if (persistence.detalles)
            for (const detalle of persistence.detalles)
                detalles.push(OrderDetail.create(
                    OrderDetalleId.create(detalle.id),
                    ProductId.create(detalle.id_producto),
                    OrderDetalleCantidad.create(detalle.cantidad)
                ))

        console.log("Orden persistenca: ", persistence)
        console.log("Antes de crear")

        const orderEstado = persistence.detalles.length === 0
            ? OrderEstado.create(EnumOrderEstados.CREATED)
            : estado ? OrderEstado.create(estado.estado.nombre) : OrderEstado.create(EnumOrderEstados.CREATED)

        console.log(orderEstado)


        const order = Order.create(
            OrderId.create(persistence.id),
            orderEstado,
            OrderCreationDate.create(persistence.fecha_creacion),
            OrderTotal.create(persistence.monto_total),
            detalles
        )

        return order

    }


}