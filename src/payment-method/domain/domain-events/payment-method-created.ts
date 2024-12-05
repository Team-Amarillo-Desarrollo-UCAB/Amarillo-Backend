import { DomainEvent } from "src/common/domain/domain-event/domain-event.interface";
import { EnumPaymentMethod } from "../enum/PaymentMethod";

export class PaymentMethodCreated extends DomainEvent {
    protected constructor(
        public id: string,
        public name: EnumPaymentMethod,
        public status: boolean
    ) {
        super();
    }

    public static create(
        id: string,
        name: EnumPaymentMethod,
        status: boolean
    ) {

        return new PaymentMethodCreated(
            id,
            name,
            status

        );
    }

}