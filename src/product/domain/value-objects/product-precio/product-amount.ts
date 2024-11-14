import { IValueObject } from "src/common/domain/value-object/value-object.interface";

export class ProductAmount implements IValueObject<ProductAmount>{
    private readonly amount: number

    protected constructor(amount: number){
        if(amount <= 0)
            throw new Error('El monto debe ser mayor a cero')
        this.amount = amount
    }

    get Monto(): number{
        return this.amount
    }

    equals(valueObject: ProductAmount): boolean {
        return this.amount === valueObject.Monto
    }

    static create(monto: number): ProductAmount{
        return new ProductAmount(monto)
    }
    
}