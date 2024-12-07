import { IValueObject } from "src/common/domain/value-object/value-object.interface";

export class OrderBundleAmount implements IValueObject<OrderBundleAmount> {
    private readonly amount: number

    protected constructor(amount: number) {
        if (amount <= 0)
            throw new Error('El monto del combo debe ser mayor a cero')
        this.amount = amount
    }

    get Monto(): number {
        return this.amount
    }

    equals(valueObject: OrderBundleAmount): boolean {
        return this.amount === valueObject.Monto
    }

    static create(monto: number): OrderBundleAmount {
        return new OrderBundleAmount(monto)
    }

}