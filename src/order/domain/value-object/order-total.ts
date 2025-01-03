import { IValueObject } from "src/common/domain/value-object/value-object.interface";
import { InvalidOrderTotal } from "../domain-exception/invalid-order-total";
import { Moneda } from "src/product/domain/enum/Monedas";

export class OrderTotal implements IValueObject<OrderTotal> {

    protected constructor(
        private readonly monto_total: number,
        private readonly moneda: Moneda
    ) {

        if(!moneda || moneda === null)
            throw new InvalidOrderTotal("La moneda no debe ser invalida")

        if(monto_total < 0)
            throw new InvalidOrderTotal("Monto total debe ser mayor a 0")

        this.monto_total = monto_total
    }

    get Total() {
        return this.monto_total
    }

    get Currency() {
        return this.moneda
    }

    equals(valueObject: OrderTotal): boolean {
        return this.monto_total === valueObject.Total && this.moneda === valueObject.Currency
    }

    static create(monto_total: number, currency: Moneda): OrderTotal {
        return new OrderTotal(monto_total,currency)
    }

}