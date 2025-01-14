import { IValueObject } from "src/common/domain/value-object/value-object.interface";
import { InvalidOrderCreationDate } from "../domain-exception/invalid-order-date";

export class OrderCreationDate implements IValueObject<OrderCreationDate> {

    protected constructor(
        private readonly date_creation: Date
    ) {

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