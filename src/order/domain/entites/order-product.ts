import { Entity } from "src/common/domain/entity/entity";
import { ProductId } from "src/product/domain/value-objects/product-id";
import { OrderDetalleId } from "../value-object/order-detalle.ts/order-detalle-id";
import { OrderDetalleCantidad } from "../value-object/order-detalle.ts/order-detalle-cantidad";

export class OrderProduct extends Entity<ProductId> {

    protected constructor(
        id: ProductId,
        private readonly cantidad: OrderDetalleCantidad
    ) {
        super(id)
        this.cantidad = cantidad
    }


}