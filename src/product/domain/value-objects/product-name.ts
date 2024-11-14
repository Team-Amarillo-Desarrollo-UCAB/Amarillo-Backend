import { IValueObject } from "src/common/domain/value-object/value-object.interface";

export class ProductName implements IValueObject<ProductName>{
    
    private readonly name: string;

    protected constructor(name: string){
        let _existente: boolean = true;

        if (!name) _existente = false;

        if (!_existente) throw new Error('El nombre del producto no puede ser vacío');

        this.name = name;
    }

    get Name(): string{
        return this.name;
    }

    equals(valueObject: ProductName): boolean {
        return this.name === valueObject.name
    }

    static create(name: string): ProductName{
        return new ProductName(name)
    }
}