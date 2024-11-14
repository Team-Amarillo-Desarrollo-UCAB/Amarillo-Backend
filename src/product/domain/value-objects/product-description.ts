import { IValueObject } from "src/common/domain/value-object/value-object.interface";

export class ProductDescription implements IValueObject<ProductDescription>{
    
    private readonly description: string;

    protected constructor(description: string){
        let _existente: boolean = true;

        if (!description) _existente = false;

        if (!_existente) throw new Error('La descripcion del producto no puede ser vacío');

        this.description = description;
    }

    get Description(): string{
        return this.description;
    }

    equals(valueObject: ProductDescription): boolean {
        return this.description === valueObject.description
    }

    static create(description: string): ProductDescription{
        return new ProductDescription(description)
    }
}