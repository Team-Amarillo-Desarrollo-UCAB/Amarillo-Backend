import { IValueObject } from "src/common/domain/value-object/value-object.interface";
import { InvalidOrderReciviedDate } from "../domain-exception/invalid-recivied-date";

export class OrderReciviedDate implements IValueObject<OrderReciviedDate> {

    protected constructor(
        private readonly date_recivied: Date
    ) {
        const today = new Date();

        if (
            date_recivied === null
        ) {
            throw new InvalidOrderReciviedDate("La fecha de entrega no puede ser nula");
        }


        this.date_recivied = date_recivied
    }

    get ReciviedDate() {
        return this.date_recivied
    }

    equals(valueObject: OrderReciviedDate): boolean {
        return this.date_recivied === valueObject.ReciviedDate
    }

    static create(fecha: Date): OrderReciviedDate {
        return new OrderReciviedDate(fecha)
    }

}