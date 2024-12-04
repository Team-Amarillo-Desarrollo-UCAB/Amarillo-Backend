import { IValueObject } from "src/common/domain/value-object/value-object.interface";

export class OrderProductName implements IValueObject<OrderProductName>{

    private readonly name: string;

    protected constructor(name: string){
        let _existente: boolean = true;

        if (!name) _existente = false;

        if (!_existente) throw new Error('El nombre del producto no puede ser vacío');

        this.name = name;
    }

    get Value(): string{
        return this.name;
    }

    equals(valueObject: OrderProductName): boolean {
        return this.name === valueObject.name
    }

    static create(name: string): OrderProductName{
        return new OrderProductName(name)
    }
}