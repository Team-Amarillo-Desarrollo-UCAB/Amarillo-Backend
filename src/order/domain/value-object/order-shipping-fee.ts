import { IValueObject } from "src/common/domain/value-object/value-object.interface"
import { InvalidOrderShippingFee } from "../domain-exception/invalid-order-shipping-fee"

export class OrderShippingFee implements IValueObject<OrderShippingFee> {

    protected constructor(
        private readonly shipping_fee: number
    ) {

        if (shipping_fee === undefined)
            throw new InvalidOrderShippingFee("El shipping fee es invalido")

        if (shipping_fee < 0)
            throw new InvalidOrderShippingFee("El shipping fee no puede ser menor a 0")

        this.shipping_fee = shipping_fee
    }

    get Value(): number {
        return this.shipping_fee
    }

    equals(valueObject: OrderShippingFee): boolean {
        return this.shipping_fee === valueObject.Value
    }

    static create(subTotal: number): OrderShippingFee {
        return new OrderShippingFee(subTotal)
    }

}