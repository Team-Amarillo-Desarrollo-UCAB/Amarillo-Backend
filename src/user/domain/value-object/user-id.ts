import { IValueObject } from "src/common/domain/value-object/value-object.interface";

export class UserId implements IValueObject<UserId>{
    
    private readonly id: string;

    protected constructor(id: string){
        let _existente: boolean = true;

        if (!id) _existente = false;

        if (!_existente) throw new Error('El id del usuario no puede ser vacío');

        const regex = new RegExp(
            '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
        );
        if (!regex.test(id)) throw new Error('El id del usuario no es valido');

        this.id = id;
    }

    get Id(): string{
        return this.id;
    }

    equals(valueObject: UserId): boolean {
        return this.id === valueObject.id
    }

    static create(id: string): UserId{
        return new UserId(id)
    }
}