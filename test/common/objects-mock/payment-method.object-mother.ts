import { EnumPaymentMethod } from "src/payment-method/domain/enum/PaymentMethod";
import { PaymentMethod } from "src/payment-method/domain/payment-method";
import { PaymentMethodId } from "src/payment-method/domain/value-objects/payment-method-id";
import { PaymentMethodName } from "src/payment-method/domain/value-objects/payment-method-name";
import { PaymentMethodState } from "src/payment-method/domain/value-objects/payment-method-state";

export class PaymentMethodObjectMock{

    static createNormal(
        name: EnumPaymentMethod
    ): PaymentMethod{
        return PaymentMethod.create(
            PaymentMethodId.create('f47ac10b-58cc-4372-a567-0e02b2c3d479'),
            PaymentMethodName.create(name),
            PaymentMethodState.create(true)
        )
    }

}