import { AggregateRoot } from "src/common/domain/aggregate-root/aggregate-root";
import { PaymentMethodId } from "./value-objects/payment-method-id";
import { DomainEvent } from "src/common/domain/domain-event/domain-event.interface";
import { PaymentMethodName } from "./value-objects/payment-method-name";
import { PaymentMethodCreated } from "./domain-events/payment-method-created";
import { InvalidPaymentMethod } from "./domain-exception/invalid-payment-method";
import { PaymentMethodState } from './value-objects/payment-method-state';

export class PaymentMethod extends AggregateRoot<PaymentMethodId> {

    private constructor(
        id: PaymentMethodId,
        private nombre: PaymentMethodName,
        private status: PaymentMethodState
    ) {
        const event = PaymentMethodCreated.create(
            id.Id,
            nombre.Value(),
            status.Value()
        )
        super(id, event)
    }

    NameMethod(){
        return this.nombre
    }

    Status(){
        return this.status
    }

    protected applyEvent(event: DomainEvent): void {
        switch (event.eventName) {
            //patron estado o estrategia, esto es una cochinada el switch case
            case 'PaymentMethodCreated':
                const paymentMeodthCreated: PaymentMethodCreated = event as PaymentMethodCreated;
                this.nombre = PaymentMethodName.create(paymentMeodthCreated.name)
                this.status = PaymentMethodState.create(paymentMeodthCreated.status)
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
        nombre: PaymentMethodName,
        status: PaymentMethodState
    ) {
        return new PaymentMethod(id, nombre,status)
    }

}