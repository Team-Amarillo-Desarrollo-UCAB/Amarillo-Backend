import { IMapper } from 'src/common/application/mappers/mapper.interface';
import { OrderPayment } from 'src/order/domain/entites/order-payment';
import { Payment } from '../entites/payment.entity';
import { OrderPaymentId } from 'src/order/domain/value-object/oder-payment/order-payment-id';
import { OrderPaymentName } from 'src/order/domain/value-object/oder-payment/order-payment-name';
import { OrderPaymentCurrency } from '../../domain/value-object/oder-payment/order-payment-currency';
import { OrderTotal } from 'src/order/domain/value-object/order-total';

export class PaymentMapper implements IMapper<OrderPayment, Payment> {

    async fromDomainToPersistence(domain: OrderPayment): Promise<Payment> {

        const pago_orm = Payment.create(
            domain.Id.Id,
            domain.AmountPayment().Total,
            domain.NameMethod().Name(),
            domain.CurrencyPayment().Currency
        )

        return pago_orm
    }

    async fromPersistenceToDomain(persistence: Payment): Promise<OrderPayment> {

        const pago = OrderPayment.create(
            OrderPaymentId.create(persistence.id),
            OrderPaymentName.create(persistence.metodo),
            OrderPaymentCurrency.create(persistence.moneda),
            OrderTotal.create(persistence.monto, persistence.moneda)
        )

        return pago

    }

}