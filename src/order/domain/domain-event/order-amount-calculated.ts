import { DomainEvent } from 'src/common/domain/domain-event/domain-event.interface';

export class OrderTotalCalculated extends DomainEvent {
    protected constructor(
        public id: string,
        public total: number
    ) {
        super();
    }

    static create(id: string, total: number) {
        return new OrderTotalCalculated(id, total);
    }
}