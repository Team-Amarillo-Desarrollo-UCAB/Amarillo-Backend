import { DomainEvent } from "src/common/domain/domain-event/domain-event.interface";

export class OrderBillRecivied extends DomainEvent {
    protected constructor(
        public id: string,
        public factura: string,
    ) {
        super();
    }

    public static create(
        id: string,
        factura: string,
    ): OrderBillRecivied {
        return new OrderBillRecivied(
            id,
            factura
        );
    }
}