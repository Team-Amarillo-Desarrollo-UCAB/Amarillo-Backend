import { IValueObject } from "src/common/domain/value-object/value-object.interface"

export class OrderProductCantidad implements IValueObject<OrderProductCantidad> {

    protected constructor(
        private readonly cantidad: number
    ) {
        if(cantidad < 0)
            throw new Error("cantidad debe ser mayor a 0")

        this.cantidad = cantidad
    }

    get Value() {
        return this.cantidad
    }

    equals(valueObject: OrderProductCantidad): boolean {
        return this.cantidad === valueObject.Value
    }

    static create(cantidad: number): OrderProductCantidad {
        return new OrderProductCantidad(cantidad)
    }

}