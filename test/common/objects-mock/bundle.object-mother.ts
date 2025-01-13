import { Bundle } from "src/bundle/domain/bundle.entity";
import { BundleCurrency } from "src/bundle/domain/enum/bundle-currency-enum";
import { Measurement } from "src/bundle/domain/enum/measurement-enum";
import { BundleDescription } from "src/bundle/domain/value-objects/bundle-description";
import { BundleID } from "src/bundle/domain/value-objects/bundle-id";
import { BundleImage } from "src/bundle/domain/value-objects/bundle-image";
import { BundleName } from "src/bundle/domain/value-objects/bundle-name";
import { BundlePrice } from "src/bundle/domain/value-objects/bundle-price";
import { BundleWeight } from "src/bundle/domain/value-objects/bundle-weight";
import { Category } from "src/category/domain/category.entity";
import { UuidGenerator } from "src/common/infraestructure/id-generator/uuid-generator";
import { CategoryMockRepository } from "../repository-mock/category-repository.mock";
import { DiscountMockRepository } from "../repository-mock/discount-repository.mock";
import { CategoryObjectMother } from "./category.object-mother";
import { DiscountObjectMother } from "./discount.object-mother";
import { BundleStock } from "src/bundle/domain/value-objects/bundle-stock";
import { ProductObjectMother } from "./product.object-mother";
import { ProductRepositoryMock } from "../repository-mock/product-repository.mock";
import { Product } from "src/product/domain/product";
import { BundleCaducityDate } from "src/bundle/domain/value-objects/bundle-caducityDate";

export class BundleObjectMother {

    static async createNormalBundle(name: string) {

        const c1 = await CategoryObjectMother.createNormalCategory('BunCat1')
        const c2 = await CategoryObjectMother.createNormalCategory('BunCat2')

        const p1 = await ProductObjectMother.createNormalProduct('PB1')
        const p2 = await ProductObjectMother.createNormalProduct('PB2')

        const discount = await DiscountObjectMother.createNormalDiscount('descuento prueba bundle object mother')


        const categoryRepositoryMock = new CategoryMockRepository();


        categoryRepositoryMock.createCategory(c1)
        categoryRepositoryMock.createCategory(c2)

        const categories: Category[] = []

        categories.push(c1)
        categories.push(c2)

        const discountRepositoryMock = new DiscountMockRepository()

        discountRepositoryMock.createDiscount(discount)

        const productRepositoryMock = new ProductRepositoryMock();

        productRepositoryMock.createProduct(p1)
        productRepositoryMock.createProduct(p2)

        const productos: Product[] = []

        productos.push(p1)
        productos.push(p2)

        const idGenerator = new UuidGenerator();

        //   id: BundleID,
        //   bundleName: BundleName,
        //   bundleDescription: BundleDescription,
        //   bundleWeight: BundleWeight,
        //   bundlePrice: BundlePrice,
        //   bundleCategories: CategoryID[],
        //   bundleImages: BundleImage[],
        //   bundleStock: BundleStock,
        //   bundleProducts: ProductId[],
        //   bundleCaducityDate?: BundleCaducityDate,
        //   discount?:DiscountID

        const images: string[] = ["BIm1", "BIm2"]
        const bundleImages = images.map(image => BundleImage.create(image));


        const normalBundle = Bundle.create(
            BundleID.create(await idGenerator.generateId()),
            BundleName.create(name),
            BundleDescription.create('Description bundle testing'),
            BundleWeight.create(1, Measurement.KG),
            BundlePrice.create(20, BundleCurrency.USD),
            categories.map(i => i.Id),
            bundleImages,
            BundleStock.create(25),
            productos.map(i => i.Id),
            BundleCaducityDate.create(new Date(2026, 0, 1)),
            discount.Id
        )

        return normalBundle;
    }

    static async createBundleWithOutDiscount(name: string) {

        const c1 = await CategoryObjectMother.createNormalCategory('BunCat1')
        const c2 = await CategoryObjectMother.createNormalCategory('BunCat2')

        const p1 = await ProductObjectMother.createNormalProduct('PB1')
        const p2 = await ProductObjectMother.createNormalProduct('PB2')


        const categoryRepositoryMock = new CategoryMockRepository();


        categoryRepositoryMock.createCategory(c1)
        categoryRepositoryMock.createCategory(c2)

        const categories: Category[] = []

        categories.push(c1)
        categories.push(c2)

        const productRepositoryMock = new ProductRepositoryMock();

        productRepositoryMock.createProduct(p1)
        productRepositoryMock.createProduct(p2)

        const productos: Product[] = []

        productos.push(p1)
        productos.push(p2)

        const idGenerator = new UuidGenerator();

        //   id: BundleID,
        //   bundleName: BundleName,
        //   bundleDescription: BundleDescription,
        //   bundleWeight: BundleWeight,
        //   bundlePrice: BundlePrice,
        //   bundleCategories: CategoryID[],
        //   bundleImages: BundleImage[],
        //   bundleStock: BundleStock,
        //   bundleProducts: ProductId[],
        //   bundleCaducityDate?: BundleCaducityDate,
        //   discount?:DiscountID

        const images: string[] = ["BIm1", "BIm2"]
        const bundleImages = images.map(image => BundleImage.create(image));


        const normalBundle = Bundle.create(
            BundleID.create(await idGenerator.generateId()),
            BundleName.create(name),
            BundleDescription.create('Description bundle testing'),
            BundleWeight.create(1, Measurement.KG),
            BundlePrice.create(20, BundleCurrency.USD),
            categories.map(i => i.Id),
            bundleImages,
            BundleStock.create(25),
            productos.map(i => i.Id),
            BundleCaducityDate.create(new Date(2026, 0, 1)),
            null
        )

        return normalBundle;
    }

}