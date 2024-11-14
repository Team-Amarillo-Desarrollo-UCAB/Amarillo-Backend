import { Entity } from "src/common/domain/entity/entity";
import { ProductId } from "src/product/domain/value-objects/product-id";
import { OrderDetalleId } from "../value-object/order-detalle.ts/order-detalle-id";
import { OrderDetalleCantidad } from "../value-object/order-detalle.ts/order-detalle-cantidad";

export class OrderDetail extends Entity<OrderDetalleId> {
    // TODO: Agregar la referencia al combo

    protected constructor(
        id: OrderDetalleId,
        private readonly id_producto: ProductId,
        private readonly cantidad: OrderDetalleCantidad
    ) {
        super(id)
        this.id_producto = id_producto
        this.cantidad = cantidad
    }

    equals(id: OrderDetalleId): boolean {
        throw new Error("Method not implemented.");
    }

    get Cantidad() {
        return this.cantidad
    }

    get ProductoId(){
        return this.id_producto
    }

    // TODO: Validacion para que no pueda ser el detalle de un producto o combo a la vez
    validarProductoCombo(): boolean {
        return false
    }

    static create(id: OrderDetalleId, id_producto: ProductId, cantidad: OrderDetalleCantidad): OrderDetail {
        return new OrderDetail(
            id,
            id_producto,
            cantidad
        )
    }

}