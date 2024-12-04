import { DomainEvent } from "src/common/domain/domain-event/domain-event.interface";

export class CuponCreated extends DomainEvent {

    protected constructor(
        public id: string,
        public code: string,
        public expiration_date: Date,
        public amount: number,
        public creation_date: Date,
    ) {
        super()
    }

    static create(
        id: string,
        code: string,
        expiration_date: Date,
        amount: number,
        creation_date: Date
    ) {
        return new CuponCreated(id,code,expiration_date,amount,creation_date)
    }

}