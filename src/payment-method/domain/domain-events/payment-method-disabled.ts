import { DomainEvent } from "src/common/domain/domain-event/domain-event.interface";

export class PaymentMethodDisabled extends DomainEvent {
    protected constructor(
        public id: string,
        public status: boolean
    ) {
        super();
    }

    public static create(
        id: string,
        status: boolean
    ) {

        return new PaymentMethodDisabled(
            id,
            status
        );
    }

}