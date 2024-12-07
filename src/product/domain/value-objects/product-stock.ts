import { IValueObject } from "src/common/domain/value-object/value-object.interface";

export class ProductStock implements IValueObject<ProductStock>{
    
    private stock: number;

    protected constructor(stock: number){
        if(stock < 0)
            throw new Error('Stock no puede ser menor a 0');

        this.stock = stock

    }

    get Stock(): number{
        return this.stock
    }

    disminuir(stock: number){
        return new ProductStock(this.stock -= stock)
    }

    aumentar(stock: number){
        return new ProductStock(this.stock += stock)
    }

    equals(valueObject: ProductStock): boolean {
        return this.stock === valueObject.Stock
    }

    static create(stock: number): ProductStock{
        return new ProductStock(stock)
    }
}