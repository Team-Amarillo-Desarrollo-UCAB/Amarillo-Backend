import { IValueObject } from "src/common/domain/value-object/value-object.interface";

export class OrderBundleImage implements IValueObject<OrderBundleImage> {
    private readonly url: string;

    protected constructor(url: string) {
        this.url = url
    }

    get Image(): string {
        return this.url
    }

    equals(valueObject: OrderBundleImage): boolean {
        return this.url === valueObject.Image
    }

    static create(url: string): OrderBundleImage {
        return new OrderBundleImage(url)
    }

}