import { IValueObject } from "src/common/domain/value-object/value-object.interface";
import { InvalidOrderTotal } from "../domain-exception/invalid-order-total";

export class OrderTotal implements IValueObject<OrderTotal> {

    protected constructor(
        private readonly monto_total: number
    ) {
        if(monto_total < 0)
            throw new InvalidOrderTotal("Monto total debe ser mayor a 0")

        this.monto_total = monto_total
    }

    get Total() {
        return this.monto_total
    }

    equals(valueObject: OrderTotal): boolean {
        return this.monto_total === valueObject.Total
    }

    static create(monto_total: number): OrderTotal {
        return new OrderTotal(monto_total)
    }

}