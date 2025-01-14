import { IValueObject } from "src/common/domain/value-object/value-object.interface";
import { InvalidOrderCreationDate } from "../domain-exception/invalid-order-date";

export class OrderCreationDate implements IValueObject<OrderCreationDate> {

    protected constructor(
        private readonly date_creation: Date
    ) {
        const today = new Date();

        if (
            date_creation.getFullYear() > today.getFullYear() ||
            date_creation.getMonth() > today.getMonth() ||
            date_creation.getDay() > today.getDay()
        ) {
            throw new InvalidOrderCreationDate("La fecha de creación es invalida");
        }


        this.date_creation = date_creation
    }

    get Date_creation() {
        return this.date_creation
    }

    equals(valueObject: OrderCreationDate): boolean {
        return this.date_creation === valueObject.Date_creation
    }

    static create(fecha: Date): OrderCreationDate {
        return new OrderCreationDate(fecha)
    }

}