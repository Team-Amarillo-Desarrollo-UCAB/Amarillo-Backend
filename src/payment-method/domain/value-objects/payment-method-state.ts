import { IValueObject } from "src/common/domain/value-object/value-object.interface";

export class PaymentMethodState implements IValueObject<PaymentMethodState> {

    protected constructor(
        private readonly active: boolean
    ) {
        this.active = active
    }

    Value(){
        return this.active
    }

    equals(valueObject: PaymentMethodState): boolean {
        return this.active === valueObject.Value()
    }

    static create(active: boolean) {
        return new PaymentMethodState(active)
    }

}