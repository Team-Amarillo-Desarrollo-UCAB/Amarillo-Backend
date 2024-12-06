import { IValueObject } from "src/common/domain/value-object/value-object.interface";

export class DiscountImage implements IValueObject<DiscountImage>{
    private readonly url: string;

    protected constructor(url: string){
        this.url = url
    }

    get Image(): string{
        return this.url
    }

    equals(valueObject: DiscountImage): boolean {
        return this.url === valueObject.Image
    }

    static create(url: string): DiscountImage{
        return new DiscountImage(url)
    }
    
}