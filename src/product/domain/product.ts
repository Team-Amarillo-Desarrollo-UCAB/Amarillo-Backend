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
import { UnidadMedida } from "./enum/UnidadMedida";
import { ProductCreated } from "./domain-event/product-created-event";
import { ProductCantidadMedida } from "./value-objects/product-unit/product-cantidad-medida";
import { ProductAmount } from "./value-objects/product-precio/product-amount";
import { ProductCurrency } from "./value-objects/product-precio/product-currency";

export class Product extends AggregateRoot<ProductId> {

    constructor(
        id: ProductId,
        private name: ProductName,
        private description: ProductDescription,
        private unit: ProductUnit,
        private price: ProductPrice,
        private image: ProductImage,
        private stock: ProductStock
    ) {
        const event = ProductCreated.create(
            id.Id,
            name.Name,
            description.Description,
            unit.Unit,
            unit.Cantidad_medida,
            price.Amount,
            price.Currency,
            image.Image,
            stock.Stock
        );
        super(id, event)
    }

    get Name(): string {
        return this.name.Name;
    }

    get Description(): string {
        return this.description.Description;
    }

    get Unit(): UnidadMedida {
        return this.unit.Unit;
    }

    get CantidadMedida(): number {
        return this.unit.Cantidad_medida;
    }

    get Price(): number {
        return this.price.Amount;
    }

    get Moneda(): string {
        return this.price.Currency
    }

    get Image(): string {
        return this.image.Image;
    }

    get Stock(): number {
        return this.stock.Stock;
    }

    protected applyEvent(event: DomainEvent): void {
        switch (event.eventName) {
            //patron estado o estrategia, esto es una cochinada el switch case
            case 'ProductCreated':
                const productCreated: ProductCreated = event as ProductCreated;
                this.name = ProductName.create(productCreated.name)
                this.description = ProductDescription.create(productCreated.description)
                this.unit = ProductUnit.create(
                    productCreated.unit,
                    ProductCantidadMedida.create(productCreated.cantidad_medida)
                )
                this.price = ProductPrice.create(
                    ProductAmount.create(productCreated.amount),
                    ProductCurrency.create(productCreated.currency)
                )
                this.image = ProductImage.create(productCreated.image)
                this.stock = ProductStock.create(productCreated.stock)
                break;
        }
    }
    protected ensureValidState(): void {
        if (
            !this.name ||
            !this.description ||
            !this.unit ||
            !this.price ||
            !this.image ||
            !this.stock
        )
        throw new Error('El producto tiene que ser valido');
    }

    static create(
        id: ProductId,
        name: ProductName,
        description: ProductDescription,
        unit: ProductUnit,
        price: ProductPrice,
        image: ProductImage,
        stock: ProductStock
    ): Product {
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