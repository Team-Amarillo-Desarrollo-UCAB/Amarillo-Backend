import { IValueObject } from "src/common/domain/value-object/value-object.interface"
import { InvalidOrderProductDiscount } from "../../domain-exception/invalid-order-product-discount"
import { InvalidOrderDiscount } from "../../domain-exception/invalid-order-discount"

export class OrderProductDiscount implements IValueObject<OrderProductDiscount> {

    private readonly descuento: number

    protected constructor(
        descuento: number
    ) {

        if(descuento === undefined)
            throw new InvalidOrderProductDiscount("El descuento no puede ser null")

        if(descuento < 0)
            throw new InvalidOrderDiscount("El descuento no puede ser menor a 0")

        this.descuento = descuento
    }

    get Value() {
        return this.descuento
    }

    equals(valueObject: OrderProductDiscount): boolean {
        return this.descuento === valueObject.Value
    }

    static create(descuento: number): OrderProductDiscount {
        return new OrderProductDiscount(descuento)
    }

}