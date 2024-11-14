import { IValueObject } from "src/common/domain/value-object/value-object.interface";

export class OrderId implements IValueObject<OrderId>{

    private readonly id: string;

    protected constructor(id: string){
        let _existente: boolean = true;

        if (!id) _existente = false;

        if (!_existente) throw new Error('El id de la orden no puede ser vacío');

        const regex = new RegExp(
            '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
        );
        if (!regex.test(id)) throw new Error("El id de la orden no puede ser vacío");

        this.id = id;
    }

    get Id(): string{
        return this.id;
    }

    equals(valueObject: OrderId): boolean {
        return this.id === valueObject.id
    }

    static create(id: string): OrderId{
        return new OrderId(id)
    }
}