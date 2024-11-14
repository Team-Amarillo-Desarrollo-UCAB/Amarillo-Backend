import { IValueObject } from "src/common/domain/value-object/value-object.interface";

export class ProductImage implements IValueObject<ProductImage>{
    private readonly url: string;

    protected constructor(url: string){
        this.url = url
    }

    get Image(): string{
        return this.url
    }

    equals(valueObject: ProductImage): boolean {
        return this.url === valueObject.Image
    }

    static create(url: string): ProductImage{
        return new ProductImage(url)
    }
    
}