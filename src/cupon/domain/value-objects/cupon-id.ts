import { UUID } from "crypto";
import { IValueObject } from "src/common/domain/value-object/value-object.interface";

export class CuponId implements IValueObject<CuponId>{
    // TODO: Implementar invariantes del codigo
    protected constructor(
        private readonly id: string
    ){
        let _existente: boolean = true;

        if (!id) _existente = false;

        if (!_existente) throw new Error('El id del cupon no puede ser vacío');

        const regex = new RegExp(
            '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
        );
        if (!regex.test(id)) throw new Error("El id del cupon no puede ser vacío");
    }

    Id(){
        return this.id
    }

    equals(valueObject: CuponId): boolean {
        return this.id === valueObject.id
    }

    static create(id: string): CuponId{
        return new CuponId(id)
    }

}