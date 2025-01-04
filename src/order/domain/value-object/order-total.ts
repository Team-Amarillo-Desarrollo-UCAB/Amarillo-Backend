import { IValueObject } from "src/common/domain/value-object/value-object.interface";
import { InvalidOrderTotal } from "../domain-exception/invalid-order-total";
import { Moneda } from "src/product/domain/enum/Monedas";
import { OrderDiscount } from "./order-discount";
import { OrderSubTotal } from "./order-subtotal";
import { OrderShippingFee } from "./order-shipping-fee";

export class OrderTotal implements IValueObject<OrderTotal> {

    protected constructor(
        private readonly monto_total: number,
        private readonly moneda: Moneda,
        private readonly descuento: OrderDiscount,
        private readonly subTotal: OrderSubTotal,
        private readonly shippingFee: OrderShippingFee
    ) {

        if (!moneda || moneda === null)
            throw new InvalidOrderTotal("La moneda no debe ser invalida")

        if (monto_total < 0)
            throw new InvalidOrderTotal("Monto total debe ser mayor a 0")

        this.monto_total = monto_total
        this.moneda = moneda
        this.descuento
    }

    get Total() {
        return this.monto_total
    }

    get Currency() {
        return this.moneda
    }

    get Discount() {
        return this.descuento
    }

    get SubTotal() {
        return this.subTotal
    }

    get ShippingFee() {
        return this.shippingFee
    }

    private calcular(): number {
        return this.subTotal.Value - this.descuento.Value
    }

    equals(valueObject: OrderTotal): boolean {
        return this.monto_total === valueObject.Total &&
            this.moneda === valueObject.Currency &&
            this.descuento.equals(valueObject.Discount) &&
            this.subTotal.equals(valueObject.SubTotal)
    }

    static create(
        monto_total: number,
        currency: Moneda,
        descuento: OrderDiscount,
        subTotal: OrderSubTotal,
        shippingFee: OrderShippingFee
    ): OrderTotal {
        return new OrderTotal(
            monto_total,
            currency,
            descuento,
            subTotal,
            shippingFee
        )
    }

}