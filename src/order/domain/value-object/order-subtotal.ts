import { IValueObject } from "src/common/domain/value-object/value-object.interface"
import { InvalidOrderSubTotal } from "../domain-exception/invalid-order-subtotal"

export class OrderSubTotal implements IValueObject<OrderSubTotal> {

    protected constructor(
        private readonly subTotal: number
    ) {

        if (subTotal === undefined)
            throw new InvalidOrderSubTotal("El subtotal es invalido")

        if (subTotal <= 0)
            throw new InvalidOrderSubTotal("El subtotal debe ser mayor a 0")

        this.subTotal = subTotal
    }

    get Value() {
        return this.subTotal
    }

    equals(valueObject: OrderSubTotal): boolean {
        return this.subTotal === valueObject.Value
    }

    static create(subTotal: number): OrderSubTotal {
        return new OrderSubTotal(subTotal)
    }

}