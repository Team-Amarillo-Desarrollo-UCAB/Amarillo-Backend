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
import { DiscountID } from "src/discount/domain/value-objects/discount-id";
import { ProductCaducityDate } from "./value-objects/productCaducityDate";
import { ProductWeight } from './value-objects/product-weight';
import { Category } from '../../category/domain/category.entity';
import { Moneda } from "./enum/Monedas";
import { ProductCaducityDateModified } from "./domain-event/product-caducityDate-modified";
import { ProductCategoryModified } from "./domain-event/product-categories-modified";
import { ProductDiscountModified } from "./domain-event/product-discount-modified";
import { ProductImagesModified } from "./domain-event/product-images-modified";
import { ProductNameModified } from "./domain-event/product-name-modified";
import { ProductUnitModified } from "./domain-event/product-unit-modified";
import { Product3DImage } from "./value-objects/product-3d-image";

export class Product extends AggregateRoot<ProductId> {

    constructor(
        id: ProductId,
        private name: ProductName,
        private description: ProductDescription,
        private unit: ProductUnit,
        private stock: ProductStock,
        private price?: ProductPrice,
        private images?: ProductImage[],
        private categories?: CategoryID[],
        private discount?: DiscountID,
        private caducityDate?:ProductCaducityDate,
        private image3d?:Product3DImage
    ) {
        const event = ProductCreated.create(
            id.Id,
            name.Name,
            description.Description,
            unit.Unit,
            unit.Cantidad_medida,
            price.Amount,
            price.Currency,
            images,
            stock.Stock,
            categories,
            discount,
            caducityDate,
        );
        super(id, event)

        this.ensureValidState();
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

    get Moneda(): Moneda {
        return this.price.Currency
    }

    get Images(): ProductImage[] {
        return this.images;
    }

    get Stock(): number {
        return this.stock.Stock;
    }

    get Categories(): CategoryID[] {
        return this.categories
    }

    get Discount(): DiscountID{
        return this.discount
    }

    get ProductCaducityDate(): ProductCaducityDate | undefined {
        return this.caducityDate;
    }

    get Image3D(): Product3DImage | undefined{
        return this.image3d
    }



    decreaseStock(stock: ProductStock) {
        if (stock.Stock < this.stock.Stock)
            this.stock = this.stock.disminuir(stock.Stock)
    }

    increaseStock(stock: ProductStock) {
        if (stock.Stock > this.stock.Stock)
            this.stock = this.stock.aumentar(stock.Stock)
    }

    public updateCaducityDate(caducityDate: ProductCaducityDate): void {
        this.onEvent(ProductCaducityDateModified.create(this.Id.Id, caducityDate.Value));  
    }

    public updateCategories(categories: CategoryID[]){
        this.onEvent(ProductCategoryModified.create(this.Id.Id, categories.map(i=>i.Value)))
    }

    public updateDescription(description: ProductDescription): void {
        this.onEvent(ProductDescriptionModified.create(this.Id.Id, description.Description));
    }

    public updateDiscount(discount: DiscountID):void{
        this.onEvent(ProductDiscountModified.create(this.Id.Id, discount.Value))
    }

    public updateImages(images:ProductImage[]){
        this.onEvent(ProductImagesModified.create(this.Id.Id, images.map(i=>i.Image)))
    }

    public updateName(name: ProductName): void {
        this.onEvent(ProductNameModified.create(this.Id.Id, name.Name));
    }

    public updatePrice(price: ProductPrice): void {
        this.onEvent(ProductPriceModified.create(this.Id.Id, price.Amount, price.Currency));
    }
    
    public updateStock(stock: ProductStock): void {
        this.onEvent(ProductStockModified.create(this.Id.Id, stock.Stock));
    }

    public updateUnit(unit: ProductUnit): void {
        this.onEvent(ProductUnitModified.create(this.Id.Id,unit.Cantidad_medida ,unit.Unit));
    }





    protected applyEvent(event: DomainEvent): void {
        switch (event.eventName) {
            case 'ProductCreated':
                const productCreated: ProductCreated = event as ProductCreated;
                
                this.name = ProductName.create(productCreated.name);
                this.description = ProductDescription.create(productCreated.description);
                this.unit = ProductUnit.create(
                    productCreated.unit,
                    ProductCantidadMedida.create(productCreated.cantidad_medida)
                );
                this.price = ProductPrice.create(
                    ProductAmount.create(productCreated.amount),
                    ProductCurrency.create(productCreated.currency)
                );
                this.images = productCreated.images.map(i => ProductImage.create(i.Image));
                this.stock = ProductStock.create(productCreated.stock);
                this.categories = productCreated.categories;
    
                if (productCreated.discount) {
                    this.discount = DiscountID.create(productCreated.discount.Value);
                }
    
                if (productCreated.caducityDate) {
                    this.caducityDate = ProductCaducityDate.create(productCreated.caducityDate.Value);
                }
    
                break;
                case 'ProductNameModified':
                    const nameModified = event as ProductNameModified;
                    this.name = ProductName.create(nameModified.nombre);
                    break;
          
                  case 'ProductDescriptionModified':
                    const descriptionModified = event as ProductDescriptionModified;
                    this.description = ProductDescription.create(descriptionModified.descipcion);
                    break;
          
                  case 'ProductPriceModified':
                    const priceModified = event as ProductPriceModified;
                    this.price = ProductPrice.create(ProductAmount.create(priceModified.precio), ProductCurrency.create(priceModified.moneda));
                    break;
          
                  case 'ProductStockModified':
                    const stockModified = event as ProductStockModified;
                    this.stock = ProductStock.create(stockModified.stock);
                    break;
          
                  case 'ProductUnitModified':
                    const unitModified = event as ProductUnitModified;
                    this.unit = ProductUnit.create(unitModified.unit,ProductCantidadMedida.create(unitModified.cantidad_medida));
                    break;
          
                  case 'ProductCaducityDateModified':
                    const caducityDateModified = event as ProductCaducityDateModified;
                    this.caducityDate = caducityDateModified.date ? ProductCaducityDate.create(caducityDateModified.date) : undefined;
                    break;
          
                  case 'ProductCategoryModified':
                  const categoryModified = event as ProductCategoryModified;
          
                  let cats: CategoryID[] = [];
                   
                   for (const cm of categoryModified.category){
                    cats.push(CategoryID.create(cm));
                   }
                  this.categories = cats;
                  break;
          
                 case 'ProductDiscountModified':
                  const discountModified = event as ProductDiscountModified;
                  this.discount = discountModified.discount ? DiscountID.create(discountModified.discount) : undefined;
                    break;
          
                  case 'ProductImagesModified':
                  const imagesModified = event as ProductImagesModified;
                  
                  let imas: ProductImage[] = [];
                   
                  for (const im of imagesModified.images){
                   imas.push(ProductImage.create(im));
                  }
                 this.images = imas;
                 break;
                 
        }
    }
    
    protected ensureValidState(): void {
        if (
            !this.name ||
            !this.description ||
            !this.unit ||
            !this.images ||
            !this.stock
        )
            throw new Error('El producto tiene que ser valido');
    }

    static create(
        id: ProductId,
        name: ProductName,
        description: ProductDescription,
        unit: ProductUnit,
        images: ProductImage[],
        stock: ProductStock,
        price?: ProductPrice,
        categories?: CategoryID[],
        discount?: DiscountID,
        caducityDate?: ProductCaducityDate,
        image3d?: Product3DImage
    ): Product {
        return new Product(
            id,
            name,
            description,
            unit,
            stock,
            price,
            images,
            categories,
            discount,
            caducityDate,
            image3d
        )
    }

}