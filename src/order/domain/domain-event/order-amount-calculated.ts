import { DomainEvent } from 'src/common/domain/domain-event/domain-event.interface';
import { Moneda } from 'src/product/domain/enum/Monedas';

export class OrderTotalCalculated extends DomainEvent {
    protected constructor(
        public id: string,
        public total: number,
        public subTotal: number,
        public moneda: Moneda,
        public descuento: number,
        public shippingFee: number
    ) {
        super();
    }

    static create(
        id: string,
        total: number,
        subTotal: number,
        moneda: Moneda,
        descuento: number,
        shippingFee: number
    ) {
        return new OrderTotalCalculated(
            id,
            total,
            subTotal,
            moneda,
            descuento,
            shippingFee
        );
    }
}