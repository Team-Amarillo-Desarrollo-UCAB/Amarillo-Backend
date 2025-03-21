import { AggregateRoot } from "src/common/domain/aggregate-root/aggregate-root";
import { BundleCreated } from "./events/bundle-created-event";
import { BundleDescription } from "./value-objects/bundle-description";
import { BundleID } from "./value-objects/bundle-id";
import { BundleName } from "./value-objects/bundle-name";
import { BundlePrice } from "./value-objects/bundle-price";
import { CategoryID } from "src/category/domain/value-objects/category-id";
import { ProductId } from "src/product/domain/value-objects/product-id";
import { BundleImage } from "./value-objects/bundle-image";
import { BundleStock } from "./value-objects/bundle-stock";
import { BundleWeight } from './value-objects/bundle-weight';
import { BundleCaducityDate } from "./value-objects/bundle-caducityDate";
import { BundleDescriptionModified } from "./events/bundle-description-modified-event";
import { BundleNameModified } from "./events/bundle-name-modified";
import { BundlePriceModified } from "./events/bundle-price-modified-event";
import { BundleStockModified } from "./events/bundle-stock-modified-event";
import { BundleWeightModified } from "./events/bundle-weight-modified-event"; // nuevo evento
import { BundleCaducityDateModified } from "./events/bundle-caducity-date-modified-event"; // nuevo evento
import { InvalidBundleException } from "./exceptions/invalid-bundle.exception";
import { DomainEvent } from "src/common/domain/domain-event/domain-event.interface";
import { DiscountID } from "src/discount/domain/value-objects/discount-id";
import { BundleDiscountModified } from "./events/bundle-discount-modified";
import { BundleProductsModified } from "./events/bundle-products-modified-event";
import { BundleCategoryModified } from "./events/bundle-category-modified-event";
import { BundleImagesModified } from "./events/bundle-images-modified-event";
import { InvalidBundleRepeatedProductException } from "./exceptions/invalid-bundle-repeated-product.exception";
import { InvalidBundleRepeatedCategoryException } from "./exceptions/invalid-bundle-repeated-category.exception";

export class Bundle extends AggregateRoot<BundleID> {
    // Definición de atributos de la entidad
    private bundleName: BundleName;
    private bundleDescription: BundleDescription;
    private bundleWeight: BundleWeight;
    private bundlePrice: BundlePrice;
    private bundleCategories: CategoryID[];
    private bundleImages: BundleImage[];
    private bundleStock: BundleStock;
    private bundleProducts: ProductId[];
    private bundleCaducityDate?: BundleCaducityDate;
    private discount?: DiscountID
  
    // Constructor privado
    private constructor(
      id: BundleID,
      bundleName: BundleName,
      bundleDescription: BundleDescription,
      bundleWeight: BundleWeight,
      bundlePrice: BundlePrice,
      bundleCategories: CategoryID[],
      bundleImages: BundleImage[],
      bundleStock: BundleStock,
      bundleProducts: ProductId[],
      bundleCaducityDate: BundleCaducityDate,
      discount?: DiscountID
    ) {

      const bundleCreated = BundleCreated.create(
        id.Value,
        bundleName.Value,
        bundleDescription.Value,
        bundleWeight.Measurement,
        bundleWeight.Weight,
        bundlePrice.Price,
        bundlePrice.Currency,
        bundleCategories,
        bundleImages,
        bundleStock.Value,
        bundleProducts,
        bundleCaducityDate?.Value
      );
  
      super(id, bundleCreated);
  
      // Inicialización de atributos
      this.bundleName = bundleName;
      this.bundleDescription = bundleDescription;
      this.bundleWeight = bundleWeight;
      this.bundlePrice = bundlePrice;
      this.bundleCategories = bundleCategories;
      this.bundleImages = bundleImages;
      this.bundleStock = bundleStock;
      this.bundleProducts = bundleProducts;
      this.bundleCaducityDate = bundleCaducityDate;
      this.discount=discount;
  
      this.ensureValidState();
    }
  
    // Método estático para crear un Bundle
    public static create(
      id: BundleID,
      bundleName: BundleName,
      bundleDescription: BundleDescription,
      bundleWeight: BundleWeight,
      bundlePrice: BundlePrice,
      bundleCategories: CategoryID[],
      bundleImages: BundleImage[],
      bundleStock: BundleStock,
      bundleProducts: ProductId[],
      bundleCaducityDate?: BundleCaducityDate,
      discount?:DiscountID
    ): Bundle {
      return new Bundle(
        id,
        bundleName,
        bundleDescription,
        bundleWeight,
        bundlePrice,
        bundleCategories,
        bundleImages,
        bundleStock,
        bundleProducts,
        bundleCaducityDate,
        discount
      );
    }
  
    // Aplicación de eventos
    protected applyEvent(event: DomainEvent): void {
      switch (event.eventName) {
        case 'BundleCreated':
          const created = event as BundleCreated;
          this.bundleName = BundleName.create(created.name);
          this.bundleDescription = BundleDescription.create(created.description);
          this.bundleWeight = BundleWeight.create(created.weight,created.measurement);
          this.bundlePrice = BundlePrice.create(created.price,created.currency);
          this.bundleCategories = created.categories.map(c => CategoryID.create(c.Value));
          this.bundleImages = created.images.map(i => BundleImage.create(i.Value));
          this.bundleStock = BundleStock.create(created.stock);
          this.bundleProducts = created.products.map(p => ProductId.create(p.Id));
          this.bundleCaducityDate = created.bundleCaducityDate ? BundleCaducityDate.create(created.bundleCaducityDate):undefined;
          this.discount= DiscountID.create(created.discount)
          break;

        case 'BundleNameModified':
          const nameModified = event as BundleNameModified;
          this.bundleName = BundleName.create(nameModified.name);
          break;

        case 'BundleDescriptionModified':
          const descriptionModified = event as BundleDescriptionModified;
          this.bundleDescription = BundleDescription.create(descriptionModified.description);
          break;

        case 'BundlePriceModified':
          const priceModified = event as BundlePriceModified;
          this.bundlePrice = BundlePrice.create(priceModified.price,priceModified.currency);
          break;

        case 'BundleStockModified':
          const stockModified = event as BundleStockModified;
          this.bundleStock = BundleStock.create(stockModified.stock);
          break;

        case 'BundleWeightModified':
          const weightModified = event as BundleWeightModified;
          this.bundleWeight = BundleWeight.create(weightModified.weight,weightModified.measurement);
          break;

        case 'BundleCaducityDateModified':
          const caducityDateModified = event as BundleCaducityDateModified;
          this.bundleCaducityDate = caducityDateModified.date ? BundleCaducityDate.create(caducityDateModified.date) : undefined;
          break;

        case 'BundleCategoryModified':
        const categoryModified = event as BundleCategoryModified;

        let cats: CategoryID[] = []
         
         for (const cm of categoryModified.category){

          cats.push(CategoryID.create(cm))

         }
        this.bundleCategories = cats
        break;

        case 'BundleProductsModified':
        const productsModified = event as BundleProductsModified

        let prods: ProductId[] = []
         
        for (const pr of productsModified.productIds){

         prods.push(ProductId.create(pr))

        }
       this.bundleProducts = prods
       break;

       case 'BundleDiscountModified':
        const discountModified = event as BundleDiscountModified
        this.discount = discountModified.discount ? DiscountID.create(discountModified.discount) : undefined;
          break;

        case 'BundleImagesModified':
        const imagesModified = event as BundleImagesModified
        
        let imas: BundleImage[] = []
         
        for (const im of imagesModified.images){

         imas.push(BundleImage.create(im))

        }
       this.bundleImages = imas
       break; 

         

      }
    }
  
    // Métodos para actualizar atributos específicos mediante eventos de dominio
    public updateName(name: BundleName): void {
      this.onEvent(BundleNameModified.create(this.Id.Value, name.Value));
    }
  
    public updateDescription(description: BundleDescription): void {
      this.onEvent(BundleDescriptionModified.create(this.Id.Value, description.Value));
    }
  
    public updatePrice(price: BundlePrice): void {
      this.onEvent(BundlePriceModified.create(this.Id.Value, price.Price, price.Currency));
    }
  
    public updateStock(stock: BundleStock): void {
      this.onEvent(BundleStockModified.create(this.Id.Value, stock.Value));
    }
  
    public updateWeight(weight: BundleWeight): void {
      this.onEvent(BundleWeightModified.create(this.Id.Value, weight.Weight,weight.Measurement));
    }

    public updateCaducityDate(caducityDate: BundleCaducityDate): void {
      this.onEvent(BundleCaducityDateModified.create(this.Id.Value, caducityDate.Value));
    }

    public updateDiscount(discount: DiscountID):void{
      this.onEvent(BundleDiscountModified.create(this.Id.Value, discount.Value))
    }

    public updateProducts(products: ProductId[]){
      this.onEvent(BundleProductsModified.create(this.Id.Value, products.map(i=>i.Id)))
    }

    public updateCategories(categories: CategoryID[]){
      this.onEvent(BundleCategoryModified.create(this.Id.Value, categories.map(i=>i.Value)))
    }

    public updateImages(images:BundleImage[]){
      this.onEvent(BundleImagesModified.create(this.Id.Value, images.map(i=>i.Value)))
    }
  
    // Validación del estado
    protected ensureValidState(): void {
      if (
        !this.bundleName || 
        !this.bundlePrice || 
        !this.bundleDescription ||
        !this.bundleWeight ||
        !this.bundleStock ||
        !this.bundleProducts ||
        !this.bundleCategories ||
        !this.bundleImages ||
        this.bundleCategories.length === 0 || // Al menos una categoría
        this.bundleImages.length === 0||  // Al menos una imagen
        this.bundleProducts.length===0
        
      ) {
        throw new InvalidBundleException("ERROR: El bundle debe ser creado correctamente con sus propiedades obligatorias");
      }
    
      if (
        this.bundleProducts.map(product => product.Id)
          .some((id, index, array) => array.indexOf(id) !== index)
      ) {
        throw new InvalidBundleRepeatedProductException(
          "ERROR: No se permiten productos duplicados en el bundle."
        );
      }

      if (
        this.bundleCategories.map(category => category.Value)
          .some((value, index, array) => array.indexOf(value) !== index)
      ) {
        throw new InvalidBundleRepeatedCategoryException(
          "ERROR: No se permiten categorías duplicadas en el bundle."
        );
      }

      console.log("Validación exitosa. No se encontraron problemas en el bundle.");

      
    }

    decreaseStock(stock: BundleStock) {
      if (stock.Value < this.bundleStock.Value)
          this.bundleStock = this.bundleStock.disminuir(stock.Value)
  }
  
    // Getters
    get name(): BundleName {
      return this.bundleName;
    }
  
    get description(): BundleDescription {
      return this.bundleDescription;
    }
  
    get weight(): BundleWeight {
      return this.bundleWeight;
    }
  
    get price(): BundlePrice {
      return this.bundlePrice;
    }
  
    get categories(): CategoryID[] {
      return this.bundleCategories;
    }
  
    get images(): BundleImage[] {
      return this.bundleImages;
    }
  
    get stock(): BundleStock {
      return this.bundleStock;
    }
  
    get products(): ProductId[] {
      return this.bundleProducts;
    }
  
    get caducityDate(): BundleCaducityDate | undefined {
      return this.bundleCaducityDate;
    }

    get Discount(): DiscountID | undefined{
      return this.discount;
    }
}
