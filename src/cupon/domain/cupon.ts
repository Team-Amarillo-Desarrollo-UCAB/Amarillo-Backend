import { AggregateRoot } from "src/common/domain/aggregate-root/aggregate-root";
import { CuponCode } from "./value-objects/cupon-code";
import { DomainEvent } from "src/common/domain/domain-event/domain-event.interface";
import { CuponId } from "./value-objects/cupon-id";
import { CuponExpirationDate } from "./value-objects/cupon-expiration-date";
import { CuponAmount } from "./value-objects/cupon-amount";
import { CuponCreationDate } from "./value-objects/cupon-creation-date";
import { CuponCreated } from './domain-events/cupon-created-event';

export class Cupon extends AggregateRoot<CuponId>{

    protected constructor(
        id: CuponId,
        private code:  CuponCode,
        private expiration_date: CuponExpirationDate,
        private amount: CuponAmount,
        private creation_date: CuponCreationDate
    ){
        const event = CuponCreated.create(
            id.Id(),
            code.Code(),
            expiration_date.ExpirationDate(),
            amount.Amount(),
            creation_date.CreationDate()
        )
        super(id,event)
    }

    Code(){
        return this.code.Code()
    }

    ExpirationDate(){
        return this.expiration_date.ExpirationDate()
    }

    Amount(){
        return this.amount.Amount()
    }

    CreationDate(){
        return this.creation_date.CreationDate()
    }

    protected applyEvent(event: DomainEvent): void {
        switch (event.eventName) {
            //patron estado o estrategia, esto es una cochinada el switch case
            case 'CuponCreated':
                const cuponCreated: CuponCreated = event as CuponCreated;
                this.code = CuponCode.create(cuponCreated.code)
                this.expiration_date = CuponExpirationDate.create(cuponCreated.expiration_date)
                this.amount = CuponAmount.create(cuponCreated.amount)
                this.creation_date = CuponCreationDate.create(cuponCreated.creation_date)
                break;
        }
    }

    protected ensureValidState(): void {
        if (
            !this.Amount ||
            !this.Code ||
            !this.ExpirationDate 

        )
        throw new Error('El cupon tiene que ser valido');
    }

    static create(
        id: CuponId,
        code:  CuponCode,
        expiration_date: CuponExpirationDate,
        amount: CuponAmount,
        creation_date: CuponCreationDate
    ): Cupon{
        return new Cupon(id,code,expiration_date,amount,creation_date)
    }

}