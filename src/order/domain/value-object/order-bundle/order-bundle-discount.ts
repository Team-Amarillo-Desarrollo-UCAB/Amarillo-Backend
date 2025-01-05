import { IValueObject } from "src/common/domain/value-object/value-object.interface"
import { InvalidOrderBundleDiscount } from "../../domain-exception/invalid-order-bundle-discount"

export class OrderBundleDiscount implements IValueObject<OrderBundleDiscount> {

    private readonly descuento: number

    protected constructor(
        descuento: number
    ) {

        if (descuento === undefined)
            throw new InvalidOrderBundleDiscount("El descuento no puede ser null")

        if (descuento < 0)
            throw new InvalidOrderBundleDiscount("El descuento no puede ser menor a 0")

        this.descuento = descuento
    }

    get Value() {
        return this.descuento
    }

    equals(valueObject: OrderBundleDiscount): boolean {
        return this.descuento === valueObject.Value
    }

    static create(descuento: number): OrderBundleDiscount {
        return new OrderBundleDiscount(descuento)
    }

}