import { IValueObject } from "src/common/domain/value-object/value-object.interface"

export class OrderLocationDelivery implements IValueObject<OrderLocationDelivery> {

    protected constructor(
        private readonly longitud: number,
        private readonly latitud: number
    ) {

    }

    get Location() {
        return null
    }

    equals(valueObject: OrderLocationDelivery): boolean {
        return null
    }

    static create(monto_total: number): OrderLocationDelivery {
        return null
    }

}