import { IValueObject } from "src/common/domain/value-object/value-object.interface";

export class OrderInstructions implements IValueObject<OrderInstructions> {

    constructor(
        private readonly instruccion: string
    ) { }

    get Value() {
        return this.instruccion
    }

    equals(valueObject: OrderInstructions): boolean {
        return this.instruccion === valueObject.Value
    }

    static create(instruccion: string) {
        return new OrderInstructions(instruccion)
    }

}