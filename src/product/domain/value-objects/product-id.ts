import { IValueObject } from "src/common/domain/value-object/value-object.interface";

export class ProductId implements IValueObject<ProductId>{
    
    private readonly id: string;

    protected constructor(id: string){
        let _existente: boolean = true;

        if (!id) _existente = false;

        if (!_existente) throw new Error('El id del producto no puede ser vacío');

        const regex = new RegExp(
            '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
        );
        if (!regex.test(id)) throw new Error();

        this.id = id;
    }

    get Id(): string{
        return this.id;
    }

    equals(valueObject: ProductId): boolean {
        return this.id === valueObject.id
    }

    static create(id: string): ProductId{
        return new ProductId(id)
    }
}