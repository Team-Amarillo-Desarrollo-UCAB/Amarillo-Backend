import { IMapper } from "src/common/application/mappers/mapper.interface";
import { PaymentMethod } from "src/payment-method/domain/payment-method";
import { OrmPaymentMethod } from "../entities/payment-method.entity";
import { PaymentMethodId } from "src/payment-method/domain/value-objects/payment-method-id";
import { PaymentMethodName } from "src/payment-method/domain/value-objects/payment-method-name";
import { PaymentMethodState } from "src/payment-method/domain/value-objects/payment-method-state";

export class PaymentMethodMapper implements IMapper<PaymentMethod, OrmPaymentMethod> {

    async fromDomainToPersistence(domain: PaymentMethod): Promise<OrmPaymentMethod> {
        const persistence = OrmPaymentMethod.create(
            domain.Id.Id,
            domain.NameMethod().Value(),
            domain.Status().Value()
        )
        return persistence
    }

    async fromPersistenceToDomain(persistence: OrmPaymentMethod): Promise<PaymentMethod> {
        const domain = PaymentMethod.create(
            PaymentMethodId.create(persistence.id),
            PaymentMethodName.create(persistence.name),
            PaymentMethodState.create(persistence.active)
        )

        return domain
    }

}