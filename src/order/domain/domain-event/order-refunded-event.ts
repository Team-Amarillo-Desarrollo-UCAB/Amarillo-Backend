import { DomainEvent } from "src/common/domain/domain-event/domain-event.interface";

export class OrderRefunded extends DomainEvent {

    constructor(
        public id: string,
        public monto: number,
        public moneda: string
    ) {
        super()
    }

    static create(
        id: string,
        monto: number,
        moneda: string
    ): OrderRefunded {
        return new OrderRefunded(
            id,
            monto,
            moneda
        )
    }

}