import { IMapper } from 'src/common/application/mappers/mapper.interface';
import { OrderPayment } from 'src/order/domain/entites/order-payment';
import { Payment } from '../entites/payment.entity';
import { OrderPaymentId } from 'src/order/domain/value-object/oder-payment/order-payment-id';
import { OrderPaymentName } from 'src/order/domain/value-object/oder-payment/order-payment-name';
import { OrderPaymentCurrency } from '../../domain/value-object/oder-payment/order-payment-currency';
import { OrderTotal } from 'src/order/domain/value-object/order-total';
import { OrderPaymentTotal } from 'src/order/domain/value-object/oder-payment/order-payment-total';
import { PaymentMethodId } from 'src/payment-method/domain/value-objects/payment-method-id';

export class PaymentMapper implements IMapper<OrderPayment, Payment> {

    async fromDomainToPersistence(domain: OrderPayment): Promise<Payment> {

        console.log("Pago recibido: ",domain)

        const pago_orm = Payment.create(
            domain.Id.Id,
            domain.AmountPayment().Total,
            domain.NameMethod().Name(),
            domain.CurrencyPayment().Currency,
            //domain.PaymentMethodId() ? domain.PaymentMethodId().Id : null
        )

        return pago_orm
    }

    async fromPersistenceToDomain(persistence: Payment): Promise<OrderPayment> {

        const pago = OrderPayment.create(
            OrderPaymentId.create(persistence.id),
            OrderPaymentName.create(persistence.metodo),
            OrderPaymentCurrency.create(persistence.moneda),
            OrderPaymentTotal.create(persistence.monto),
            //persistence.id_metodo ? PaymentMethodId.create(persistence.id_metodo) : null
        )

        return pago

    }

}