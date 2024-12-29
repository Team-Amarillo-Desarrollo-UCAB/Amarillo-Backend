import { IValueObject } from "src/common/domain/value-object/value-object.interface";
import { EnumPaymentMethod } from "src/payment-method/domain/enum/PaymentMethod";

export class OrderPaymentName implements IValueObject<OrderPaymentName>{

    private readonly name: EnumPaymentMethod

    protected constructor(name: EnumPaymentMethod){
        this.name = name;
    }

    Name(): EnumPaymentMethod{
        return this.name;
    }

    equals(valueObject: OrderPaymentName): boolean {
        return this.name === valueObject.Name()
    }

    static create(name: EnumPaymentMethod): OrderPaymentName{
        return new OrderPaymentName(name)
    }
}