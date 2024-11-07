/* eslint-disable @typescript-eslint/no-unused-vars */
import { ProductId } from "./value-objects/product-id";
import { ProductName } from "./value-objects/product-name";
import { ProductDescription } from "./value-objects/product-description";
import { ProductUnit } from "./value-objects/product-unit/product-unit";
import { ProductPrice } from "./value-objects/product-precio/product-price";
import { ProductImage } from "./value-objects/product-image";
import { ProductStock } from "./value-objects/product-stock";
import { AggregateRoot } from "src/common/domain/aggregate-root/aggregate-root";
import { DomainEvent } from "src/common/domain/domain-event/domain-event.interface";

export class Product extends AggregateRoot<ProductId> {

    constructor(
        id: ProductId,
        private readonly name: ProductName,
        private readonly description: ProductDescription,
        private readonly unit: ProductUnit,
        private readonly price: ProductPrice,
        private readonly image: ProductImage,
        private readonly stock: ProductStock
    ) {
        super(id)
        this.name = name,
        this.description = description,
        this.unit = unit
        this.price = price
        this.image = image
        this.stock = stock

    }

    protected applyEvent(event: DomainEvent): void {
        throw new Error("Method not implemented.");
    }
    protected ensureValidState(): void {
        throw new Error("Method not implemented.");
    }

    static create(
        id: ProductId,
        name: ProductName,
        description: ProductDescription,
        unit: ProductUnit,
        price: ProductPrice,
        image: ProductImage,
        stock: ProductStock
    ): Product{
        return new Product(
            id,
            name,
            description,
            unit,
            price,
            image,
            stock
        ) 
    }

}