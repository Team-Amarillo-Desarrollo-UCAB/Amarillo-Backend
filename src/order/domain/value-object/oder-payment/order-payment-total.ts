import { IValueObject } from "src/common/domain/value-object/value-object.interface"
import { Moneda } from "src/product/domain/enum/Monedas"
import { InvalidOrderPaymentTotal } from "../../domain-exception/invalid-payment-total"

export class OrderPaymentTotal implements IValueObject<OrderPaymentTotal> {

    protected constructor(
        private readonly monto_total: number,
    ) {

        if(monto_total < 0)
            throw new InvalidOrderPaymentTotal("Monto total debe ser mayor a 0")

        this.monto_total = monto_total
    }

    get Total() {
        return this.monto_total
    }


    equals(valueObject: OrderPaymentTotal): boolean {
        return this.monto_total === valueObject.Total
    }

    static create(monto_total: number): OrderPaymentTotal {
        return new OrderPaymentTotal(monto_total)
    }

}