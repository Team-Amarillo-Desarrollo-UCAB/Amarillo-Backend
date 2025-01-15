import { IValueObject } from "src/common/domain/value-object/value-object.interface";

export class Product3DImage implements IValueObject<Product3DImage>{
    private readonly url: string;

    protected constructor(url: string){
        this.url = url
    }

    get Image3D(): string{
        return this.url
    }

    equals(valueObject: Product3DImage): boolean {
        return this.url === valueObject.Image3D
    }

    static create(url: string): Product3DImage{
        return new Product3DImage(url)
    }
    
}