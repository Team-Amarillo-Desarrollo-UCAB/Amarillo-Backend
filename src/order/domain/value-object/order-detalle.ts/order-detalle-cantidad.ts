import { IValueObject } from "src/common/domain/value-object/value-object.interface"

export class OrderDetalleCantidad implements IValueObject<OrderDetalleCantidad> {

    protected constructor(
        private readonly cantidad: number
    ) {
        if(cantidad < 0)
            throw new Error("cantidad debe ser mayor a 0")

        this.cantidad = cantidad
    }

    get Cantidad() {
        return this.cantidad
    }

    equals(valueObject: OrderDetalleCantidad): boolean {
        return this.cantidad === valueObject.Cantidad
    }

    static create(monto_total: number): OrderDetalleCantidad {
        return new OrderDetalleCantidad(monto_total)
    }

}