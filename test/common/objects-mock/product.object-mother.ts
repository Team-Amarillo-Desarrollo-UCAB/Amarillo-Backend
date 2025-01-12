import { Category } from "src/category/domain/category.entity";
import { UuidGenerator } from "src/common/infraestructure/id-generator/uuid-generator";
import { UnidadMedida } from "src/product/domain/enum/UnidadMedida";
import { Product } from "src/product/domain/product";
import { ProductDescription } from "src/product/domain/value-objects/product-description";
import { ProductId } from "src/product/domain/value-objects/product-id";
import { ProductImage } from "src/product/domain/value-objects/product-image";
import { ProductName } from "src/product/domain/value-objects/product-name";
import { ProductStock } from "src/product/domain/value-objects/product-stock";
import { ProductCantidadMedida } from "src/product/domain/value-objects/product-unit/product-cantidad-medida";
import { ProductUnit } from "src/product/domain/value-objects/product-unit/product-unit";
import { CategoryMockRepository } from "../repository-mock/category-repository.mock";
import { DiscountMockRepository } from "../repository-mock/discount-repository.mock";
import { CategoryObjectMother } from "./category.object-mother";
import { DiscountObjectMother } from "./discount.object-mother";
import { ProductPrice } from "src/product/domain/value-objects/product-precio/product-price";
import { ProductAmount } from "src/product/domain/value-objects/product-precio/product-amount";
import { ProductCurrency } from "src/product/domain/value-objects/product-precio/product-currency";
import { Moneda } from "src/product/domain/enum/Monedas";
import { ProductCaducityDate } from "src/product/domain/value-objects/productCaducityDate";

export class ProductObjectMother{

    static async createNormalProduct(name:string){

        const c1 = await CategoryObjectMother.createNormalCategory('ProdCat1')
        const c2 = await CategoryObjectMother.createNormalCategory('ProdCat2')
        //const cNot = await CategoryObjectMother.createNormalCategory('C_NOT')

        const discount = await DiscountObjectMother.createNormalDiscount('descuento prueba producto object mother')


        const categoryRepositoryMock = new CategoryMockRepository();


        categoryRepositoryMock.createCategory(c1)
        categoryRepositoryMock.createCategory(c2)

        const categories: Category[] = []

        categories.push(c1)
        categories.push(c2)

        const discountRepositoryMock = new DiscountMockRepository()

        discountRepositoryMock.createDiscount(discount)

        const idGenerator = new UuidGenerator();

                // id: ProductId,
                // name: ProductName,
                // description: ProductDescription,
                // unit: ProductUnit,
                // images: ProductImage[],
                // stock: ProductStock,
                // price?: ProductPrice,
                // categories?: CategoryID[],
                // discount?: DiscountID,
                // caducityDate?: ProductCaducityDate

        const images: string[] = ["PIm1","PIm2"]
        const productImages = images.map(image => ProductImage.create(image));

        const normalProduct = Product.create(
            ProductId.create(await idGenerator.generateId()),
            ProductName.create(name),
            ProductDescription.create('Description testing'),
            ProductUnit.create(UnidadMedida.KG,ProductCantidadMedida.create(1)),
            productImages,
            ProductStock.create(15),
            ProductPrice.create(ProductAmount.create(25),ProductCurrency.create(Moneda.USD)),
            categories.map(i=>i.Id),
            discount.Id,
            ProductCaducityDate.create(new Date(2026, 0, 1))

        )

        return normalProduct;
    }
}