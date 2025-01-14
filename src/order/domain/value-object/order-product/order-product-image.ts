import { IValueObject } from "src/common/domain/value-object/value-object.interface";

export class OrderProductImage implements IValueObject<OrderProductImage> {
    private readonly url: string;

    protected constructor(url: string) {
        this.url = url
    }

    get Image(): string {
        return this.url
    }

    equals(valueObject: OrderProductImage): boolean {
        return this.url === valueObject.Image
    }

    static create(url: string): OrderProductImage {
        return new OrderProductImage(url)
    }

}