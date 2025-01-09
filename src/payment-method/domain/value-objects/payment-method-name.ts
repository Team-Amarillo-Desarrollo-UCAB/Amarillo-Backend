import { IValueObject } from "src/common/domain/value-object/value-object.interface";
import { EnumPaymentMethod } from "../enum/PaymentMethod";

export class PaymentMethodName implements IValueObject<PaymentMethodName> {

    protected constructor(
        private readonly name: EnumPaymentMethod
    ) {
        this.name = name
    }

    Value(): EnumPaymentMethod{
        return this.name
    }

    equals(valueObject: PaymentMethodName): boolean {
        return this.name === valueObject.Value()
    }

    static create(name: EnumPaymentMethod) {
        return new PaymentMethodName(name)
    }

}