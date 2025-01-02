import { DomainEvent } from 'src/common/domain/domain-event/domain-event.interface';
import { Moneda } from 'src/product/domain/enum/Monedas';

export class OrderTotalCalculated extends DomainEvent {
    protected constructor(
        public id: string,
        public total: number,
        public moneda: Moneda
    ) {
        super();
    }

    static create(id: string, total: number, moneda: Moneda) {
        return new OrderTotalCalculated(id, total,moneda);
    }
}