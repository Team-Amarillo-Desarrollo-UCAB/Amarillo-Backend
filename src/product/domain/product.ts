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
import { CategoryID } from "src/category/domain/value-objects/category-id";
import { ProductPriceModified } from "./domain-event/product-price-modified";
import { ProductStockModified } from "./domain-event/product-stock-modified";
import { ProductDescriptionModified } from "./domain-event/product-description-modified";

export class Product extends AggregateRoot<ProductId> {

    constructor(
        id: ProductId,
        private name: ProductName,
        private description: ProductDescription,
        private unit: ProductUnit,
        private price: ProductPrice,
        private image: ProductImage,
        private stock: ProductStock,
        private categories: CategoryID[]
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
            stock.Stock,
            categories
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

    get Categories(): CategoryID[] {
        return this.categories
    }

    modifiedName(nombre: ProductName){
        if(!this.name.equals(nombre))
            this.name = nombre
    }

    decreaseStock(stock: ProductStock) {
        if (stock.Stock < this.stock.Stock)
            this.stock = stock
    }

    increaseStock(stock: ProductStock) {
        if (stock.Stock > this.stock.Stock)
            this.stock = stock
    }

    modifieStock(stock: ProductStock) {
        if (!this.stock.equals(stock)) {
            this.stock = stock
            const event = ProductStockModified.create(
                this.Id.Id,
                this.stock.Stock
            )
            this.events.push(event)
        }

    }

    modifiedPrice(precio: ProductPrice) {

        if (!this.price.equals(precio)) {
            this.price = precio
            const event = ProductPriceModified.create(
                this.Id.Id,
                this.price.Amount,
                this.price.Currency
            )
            this.events.push(event)
        }


    }

    modifiedDescription(descripcion: ProductDescription){

        if(!this.description.equals(descripcion)){
            this.description = descripcion
            const event = ProductDescriptionModified.create(
                this.Id.Id,
                this.description.Description,
            )
        }

    }


    protected applyEvent(event: DomainEvent): void {
        switch (event.eventName) {
            //patron estado o estrategia, esto es una cochinada el switch case
            // Otra opcion es no manejarlo de esta forma, discutir luego del parcial :)
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
                this.categories = productCreated.categories
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
        stock: ProductStock,
        categories: CategoryID[]
    ): Product {
        return new Product(
            id,
            name,
            description,
            unit,
            price,
            image,
            stock,
            categories
        )
    }

}