import { IValueObject } from "src/common/domain/value-object/value-object.interface"

export class OrderBundleCantidad implements IValueObject<OrderBundleCantidad> {

    protected constructor(
        private readonly cantidad: number
    ) {
        if(cantidad < 0)
            throw new Error("cantidad del combo debe ser mayor a 0")

        this.cantidad = cantidad
    }

    get Value() {
        return this.cantidad
    }

    equals(valueObject: OrderBundleCantidad): boolean {
        return this.cantidad === valueObject.Value
    }

    static create(cantidad: number): OrderBundleCantidad {
        return new OrderBundleCantidad(cantidad)
    }

}