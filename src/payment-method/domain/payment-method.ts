import { AggregateRoot } from "src/common/domain/aggregate-root/aggregate-root";
import { PaymentMethodId } from "./value-objects/payment-method-id";
import { DomainEvent } from "src/common/domain/domain-event/domain-event.interface";
import { PaymentMethodName } from "./value-objects/payment-method-name";
import { PaymentMethodCreated } from "./domain-events/payment-method-created";
import { InvalidPaymentMethod } from "./domain-exception/invalid-payment-method";

export class PaymentMethod extends AggregateRoot<PaymentMethodId> {

    private constructor(
        id: PaymentMethodId,
        private nombre: PaymentMethodName
    ) {
        const event = PaymentMethodCreated.create(
            id.Id,
            nombre.Value()
        )
        super(id, event)
    }

    NameMethod(){
        return this.nombre
    }

    protected applyEvent(event: DomainEvent): void {
        switch (event.eventName) {
            //patron estado o estrategia, esto es una cochinada el switch case
            case 'PaymentMethodCreated':
                const paymentMeodthCreated: PaymentMethodCreated = event as PaymentMethodCreated;
                this.nombre = PaymentMethodName.create(paymentMeodthCreated.name)
                break;
        }
    }

    protected ensureValidState(): void {
        if(
            !this.nombre
        )
            throw new InvalidPaymentMethod("El metodo de pago no es valido")
    }

    static create(
        id: PaymentMethodId,
        nombre: PaymentMethodName
    ) {
        return new PaymentMethod(id, nombre)
    }

}