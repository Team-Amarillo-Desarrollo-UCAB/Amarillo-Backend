import { CreateBundleServiceEntryDto } from "src/bundle/application/dto/entry/create-bundle-service-entry.dto";
import { CreateBundleApplicationService } from "src/bundle/application/services/commands/create-bundle.service";
import { ProductsExistenceService } from "src/bundle/application/services/queries/product-existence-check.service";
import { Bundle } from "src/bundle/domain/bundle.entity";
import { BundleCurrency } from "src/bundle/domain/enum/bundle-currency-enum";
import { Measurement } from "src/bundle/domain/enum/measurement-enum";
import { Category } from "src/category/domain/category.entity";
import { CategoriesExistenceService } from "src/common/application/application-services/common-services/categories-existence-check.service";
import { DiscountExistenceService } from "src/common/application/application-services/common-services/discount-existence-check.service";
import { Product } from "src/product/domain/product";
import { BundleObjectMother } from "test/common/objects-mock/bundle.object-mother";
import { CategoryObjectMother } from "test/common/objects-mock/category.object-mother";
import { DiscountObjectMother } from "test/common/objects-mock/discount.object-mother";
import { ProductObjectMother } from "test/common/objects-mock/product.object-mother";
import { UserObjectMother } from "test/common/objects-mock/user.object-mother";
import { FileUploaderMock } from "test/common/other-mock/file-uploader.mock";
import { UuidGeneratorMock } from "test/common/other-mock/uuid-generator.mock";
import { BundleRepositoryMock } from "test/common/repository-mock/bundle-repository.mock";
import { CategoryMockRepository } from "test/common/repository-mock/category-repository.mock";
import { DiscountMockRepository } from "test/common/repository-mock/discount-repository.mock";
import { EventHandlerMock } from "test/common/repository-mock/event-handler.mock";
import { ProductRepositoryMock } from "test/common/repository-mock/product-repository.mock";
import { UserMockRepository } from "test/common/repository-mock/user-repository-mock";


describe('Create bundle', () => {

    it('should create a new bundle includding all correct values on bundle atributes', async () => {
        const user = await UserObjectMother.createAdminUser();
        const userRepositoryMock = new UserMockRepository();
        userRepositoryMock.saveUserAggregate(user)

        const c1 = await CategoryObjectMother.createNormalCategory('C1')
        const c2 = await CategoryObjectMother.createNormalCategory('C2')

        const p1 = await ProductObjectMother.createNormalProduct('P1')
        const p2 = await ProductObjectMother.createNormalProduct('P2')

        const discount = await DiscountObjectMother.createNormalDiscount('descuento prueba bundle')


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

        const discountRepositoryMock = new DiscountMockRepository()

        discountRepositoryMock.createDiscount(discount)

        const entry: CreateBundleServiceEntryDto={

            userId: user.Id.Id,
            name: "Bundle test",
            description: "desripction of the bundle",
            images: ["image1","image2"] ,
            price: 15,
            currency: BundleCurrency.USD,
            weight: 1,
            measurement: Measurement.KG,
            stock: 5,
            category: categories.map(i=>i.Id.Value),
            productId: productos.map(i=>i.Id.Id),
            caducityDate: new Date(2026, 0, 1),// Meses en JavaScript van de 0 (enero) a 11 (diciembre),
            discount: discount.ID.Value,

        }

        const service = new CreateBundleApplicationService(
            new BundleRepositoryMock(),
            new UuidGeneratorMock(),
            new FileUploaderMock(),
            new CategoriesExistenceService(categoryRepositoryMock),
            new ProductsExistenceService(productRepositoryMock),
            new DiscountExistenceService(discountRepositoryMock)

        )

        const result = await service.execute(entry)

        expect(result.isSuccess()).toBeTruthy();
    })

    it('should create a new bundle even if Discount is NULL', async () => {
        const user = await UserObjectMother.createAdminUser();
        const userRepositoryMock = new UserMockRepository();
        userRepositoryMock.saveUserAggregate(user)

        const c1 = await CategoryObjectMother.createNormalCategory('C1')
        const c2 = await CategoryObjectMother.createNormalCategory('C2')

        const p1 = await ProductObjectMother.createNormalProduct('P1')
        const p2 = await ProductObjectMother.createNormalProduct('P2')

        const discount = await DiscountObjectMother.createNormalDiscount('descuento prueba bundle')


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

        const discountRepositoryMock = new DiscountMockRepository()

        discountRepositoryMock.createDiscount(discount)

        const entry: CreateBundleServiceEntryDto={

            userId: user.Id.Id,
            name: "Bundle test",
            description: "desripction of the bundle - discount null",
            images: ["image1","image2"] ,
            price: 15,
            currency: BundleCurrency.USD,
            weight: 1,
            measurement: Measurement.KG,
            stock: 5,
            category: categories.map(i=>i.Id.Value),
            productId: productos.map(i=>i.Id.Id),
            caducityDate: new Date(2026, 0, 1),// Meses en JavaScript van de 0 (enero) a 11 (diciembre),
            discount: null,

        }

        const service = new CreateBundleApplicationService(
            new BundleRepositoryMock(),
            new UuidGeneratorMock(),
            new FileUploaderMock(),
            new CategoriesExistenceService(categoryRepositoryMock),
            new ProductsExistenceService(productRepositoryMock),
            new DiscountExistenceService(discountRepositoryMock)

        )

        const result = await service.execute(entry)

        expect(result.isSuccess()).toBeTruthy();
    })

    it('should create a new bundle even if both caducityDate and discount are NULL', async () => {
        const user = await UserObjectMother.createAdminUser();
        const userRepositoryMock = new UserMockRepository();
        userRepositoryMock.saveUserAggregate(user)

        const c1 = await CategoryObjectMother.createNormalCategory('C1')
        const c2 = await CategoryObjectMother.createNormalCategory('C2')

        const p1 = await ProductObjectMother.createNormalProduct('P1')
        const p2 = await ProductObjectMother.createNormalProduct('P2')

        const discount = await DiscountObjectMother.createNormalDiscount('descuento prueba bundle')


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

        const discountRepositoryMock = new DiscountMockRepository()

        discountRepositoryMock.createDiscount(discount)

        const entry: CreateBundleServiceEntryDto={

            userId: user.Id.Id,
            name: "Bundle test",
            description: "desripction of the bundle  - caducityDate and discount null all of them",
            images: ["image1","image2"] ,
            price: 15,
            currency: BundleCurrency.USD,
            weight: 1,
            measurement: Measurement.KG,
            stock: 5,
            category: categories.map(i=>i.Id.Value),
            productId: productos.map(i=>i.Id.Id),
            caducityDate: null,
            discount: null

        }

        const service = new CreateBundleApplicationService(
            new BundleRepositoryMock(),
            new UuidGeneratorMock(),
            new FileUploaderMock(),
            new CategoriesExistenceService(categoryRepositoryMock),
            new ProductsExistenceService(productRepositoryMock),
            new DiscountExistenceService(discountRepositoryMock)

        )

        const result = await service.execute(entry)

        expect(result.isSuccess()).toBeTruthy();
    })

    it('should create a new bundle even if caducityDate is NULL', async () => {
        const user = await UserObjectMother.createAdminUser();
        const userRepositoryMock = new UserMockRepository();
        userRepositoryMock.saveUserAggregate(user)

        const c1 = await CategoryObjectMother.createNormalCategory('C1')
        const c2 = await CategoryObjectMother.createNormalCategory('C2')

        const p1 = await ProductObjectMother.createNormalProduct('P1')
        const p2 = await ProductObjectMother.createNormalProduct('P2')

        const discount = await DiscountObjectMother.createNormalDiscount('descuento prueba bundle')


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

        const discountRepositoryMock = new DiscountMockRepository()

        discountRepositoryMock.createDiscount(discount)

        const entry: CreateBundleServiceEntryDto={

            userId: user.Id.Id,
            name: "Bundle test",
            description: "desripction of the bundle CADUCITY DATE NULL",
            images: ["image1","image2"] ,
            price: 15,
            currency: BundleCurrency.USD,
            weight: 1,
            measurement: Measurement.KG,
            stock: 5,
            category: categories.map(i=>i.Id.Value),
            productId: productos.map(i=>i.Id.Id),
            caducityDate: null,// Meses en JavaScript van de 0 (enero) a 11 (diciembre),
            discount: discount.ID.Value,

        }

        const service = new CreateBundleApplicationService(
            new BundleRepositoryMock(),
            new UuidGeneratorMock(),
            new FileUploaderMock(),
            new CategoriesExistenceService(categoryRepositoryMock),
            new ProductsExistenceService(productRepositoryMock),
            new DiscountExistenceService(discountRepositoryMock)

        )

        const result = await service.execute(entry)

        expect(result.isSuccess()).toBeTruthy();
    })



    it('should fail to create a bundle with a duplicated product', async () => {
        const user = await UserObjectMother.createAdminUser();
        const userRepositoryMock = new UserMockRepository();
        userRepositoryMock.saveUserAggregate(user);

        const c1 = await CategoryObjectMother.createNormalCategory('C1');
        const p1 = await ProductObjectMother.createNormalProduct('P1');

        const categoryRepositoryMock = new CategoryMockRepository();
        categoryRepositoryMock.createCategory(c1);

        const productRepositoryMock = new ProductRepositoryMock();
        productRepositoryMock.createProduct(p1);

        const entry: CreateBundleServiceEntryDto = {
            userId: user.Id.Id,
            name: "Bundle test duplicated product",
            description: "description of the bundle with duplicated product",
            images: ["image1"],
            price: 10,
            currency: BundleCurrency.USD,
            weight: 0.5,
            measurement: Measurement.KG,
            stock: 3,
            category: [c1.Id.Value],
            productId: [p1.Id.Id, p1.Id.Id], // Producto repetido
            caducityDate: new Date(2025, 11, 31),
            discount: null,
        };

        const service = new CreateBundleApplicationService(
            new BundleRepositoryMock(),
            new UuidGeneratorMock(),
            new FileUploaderMock(),
            new CategoriesExistenceService(categoryRepositoryMock),
            new ProductsExistenceService(productRepositoryMock),
            new DiscountExistenceService(new DiscountMockRepository())
        );

        await expect(service.execute(entry)).rejects.toThrowError(
            "ERROR: No se permiten productos duplicados en el bundle."
        );
    });

    it('should fail to create a bundle with a duplicated category', async () => {
        const user = await UserObjectMother.createAdminUser();
        const userRepositoryMock = new UserMockRepository();
        userRepositoryMock.saveUserAggregate(user);

        const c1 = await CategoryObjectMother.createNormalCategory('C1');

        const p1 = await ProductObjectMother.createNormalProduct('Pr1')
        const p2 = await ProductObjectMother.createNormalProduct('Pr2')

        const productRepositoryMock = new ProductRepositoryMock();

        productRepositoryMock.createProduct(p1)
        productRepositoryMock.createProduct(p2)

        const categoryRepositoryMock = new CategoryMockRepository();
        categoryRepositoryMock.createCategory(c1);

        const entry: CreateBundleServiceEntryDto = {
            userId: user.Id.Id,
            name: "Bundle test duplicated category",
            description: "description of the bundle with duplicated category",
            images: ["image1"],
            price: 20,
            currency: BundleCurrency.USD,
            weight: 1,
            measurement: Measurement.KG,
            stock: 2,
            category: [c1.Id.Value, c1.Id.Value], 
            productId: [p1.Id.Id, p2.Id.Id],
            caducityDate: new Date(2025, 11, 31),
            discount: null,
        };

        const service = new CreateBundleApplicationService(
            new BundleRepositoryMock(),
            new UuidGeneratorMock(),
            new FileUploaderMock(),
            new CategoriesExistenceService(categoryRepositoryMock),
            new ProductsExistenceService(productRepositoryMock),
            new DiscountExistenceService(new DiscountMockRepository())
        );

        await expect(service.execute(entry)).rejects.toThrowError(
           "ERROR: No se permiten categorías duplicadas en el bundle."
        );
    });

    it('should fail to create a bundle IF a category does not exist', async () => {
        const user = await UserObjectMother.createAdminUser();
        const userRepositoryMock = new UserMockRepository();
        userRepositoryMock.saveUserAggregate(user);

        const c1 = await CategoryObjectMother.createNormalCategory('C1');

        const p1 = await ProductObjectMother.createNormalProduct('Pr1')
        const p2 = await ProductObjectMother.createNormalProduct('Pr2')
        const notP = await ProductObjectMother.createNormalProduct('NotP')

        const productRepositoryMock = new ProductRepositoryMock();

        productRepositoryMock.createProduct(p1)
        productRepositoryMock.createProduct(p2)

        const categoryRepositoryMock = new CategoryMockRepository();
        categoryRepositoryMock.createCategory(c1);

        const entry: CreateBundleServiceEntryDto = {
            userId: user.Id.Id,
            name: "Bundle test duplicated category",
            description: "description of the bundle with duplicated category",
            images: ["image1"],
            price: 20,
            currency: BundleCurrency.USD,
            weight: 1,
            measurement: Measurement.KG,
            stock: 2,
            category: [c1.Id.Value], 
            productId: [p1.Id.Id, p2.Id.Id, notP.Id.Id],
            caducityDate: new Date(2025, 11, 31),
            discount: null,
        };

        const service = new CreateBundleApplicationService(
            new BundleRepositoryMock(),
            new UuidGeneratorMock(),
            new FileUploaderMock(),
            new CategoriesExistenceService(categoryRepositoryMock),
            new ProductsExistenceService(productRepositoryMock),
            new DiscountExistenceService(new DiscountMockRepository())
        );
        const result = await service.execute(entry)

        expect(result.isSuccess()).toBeFalsy()
    });

    it('should fail to create a bundle IF a product does not exist', async () => {
        const user = await UserObjectMother.createAdminUser();
        const userRepositoryMock = new UserMockRepository();
        userRepositoryMock.saveUserAggregate(user);

        const c1 = await CategoryObjectMother.createNormalCategory('C1');
        const notC = await CategoryObjectMother.createNormalCategory('NotC');

        const p1 = await ProductObjectMother.createNormalProduct('Pr1')
        const p2 = await ProductObjectMother.createNormalProduct('Pr2')

        const productRepositoryMock = new ProductRepositoryMock();

        productRepositoryMock.createProduct(p1)
        productRepositoryMock.createProduct(p2)

        const categoryRepositoryMock = new CategoryMockRepository();
        categoryRepositoryMock.createCategory(c1);

        const entry: CreateBundleServiceEntryDto = {
            userId: user.Id.Id,
            name: "Bundle test duplicated category",
            description: "description of the bundle with duplicated category",
            images: ["image1"],
            price: 20,
            currency: BundleCurrency.USD,
            weight: 1,
            measurement: Measurement.KG,
            stock: 2,
            category: [c1.Id.Value,notC.Id.Value], 
            productId: [p1.Id.Id, p2.Id.Id],
            caducityDate: new Date(2025, 11, 31),
            discount: null,
        };

        const service = new CreateBundleApplicationService(
            new BundleRepositoryMock(),
            new UuidGeneratorMock(),
            new FileUploaderMock(),
            new CategoriesExistenceService(categoryRepositoryMock),
            new ProductsExistenceService(productRepositoryMock),
            new DiscountExistenceService(new DiscountMockRepository())
        );
        const result = await service.execute(entry)

        expect(result.isSuccess()).toBeFalsy()
    });

    it('should fail a new bundle if name atribute, a non-optional atribute, is NULL', async () => {
        const user = await UserObjectMother.createAdminUser();
        const userRepositoryMock = new UserMockRepository();
        userRepositoryMock.saveUserAggregate(user)

        const c1 = await CategoryObjectMother.createNormalCategory('C1')
        const c2 = await CategoryObjectMother.createNormalCategory('C2')

        const p1 = await ProductObjectMother.createNormalProduct('P1')
        const p2 = await ProductObjectMother.createNormalProduct('P2')

        const discount = await DiscountObjectMother.createNormalDiscount('descuento prueba bundle')


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

        const discountRepositoryMock = new DiscountMockRepository()

        discountRepositoryMock.createDiscount(discount)

        const entry: CreateBundleServiceEntryDto={

            userId: user.Id.Id,
            name: "",
            description: "desripction of the bundle",
            images: ["image1","image2"] ,
            price: 15,
            currency: BundleCurrency.USD,
            weight: 1,
            measurement: Measurement.KG,
            stock: 5,
            category: categories.map(i=>i.Id.Value),
            productId: productos.map(i=>i.Id.Id),
            caducityDate: new Date(2026, 0, 1),// Meses en JavaScript van de 0 (enero) a 11 (diciembre),
            discount: discount.ID.Value,

        }

        const service = new CreateBundleApplicationService(
            new BundleRepositoryMock(),
            new UuidGeneratorMock(),
            new FileUploaderMock(),
            new CategoriesExistenceService(categoryRepositoryMock),
            new ProductsExistenceService(productRepositoryMock),
            new DiscountExistenceService(discountRepositoryMock)

        )

        await expect(service.execute(entry)).rejects.toThrowError(
            'El nombre del combo no debe estar vacío'
        );
    })

    //6
    it('should fail creating a new bundle if the bundle name equals another bundle name that already exists', async () => {
        const user = await UserObjectMother.createAdminUser();
        const userRepositoryMock = new UserMockRepository();
        userRepositoryMock.saveUserAggregate(user)

        const c1 = await CategoryObjectMother.createNormalCategory('C1')
        const c2 = await CategoryObjectMother.createNormalCategory('C2')

        const p1 = await ProductObjectMother.createNormalProduct('P1')
        const p2 = await ProductObjectMother.createNormalProduct('P2')

        const discount = await DiscountObjectMother.createNormalDiscount('descuento prueba bundle')

        const sameNameBundle = await BundleObjectMother.createNormalBundle("Repeated name")

        const bundleRepoMock = new BundleRepositoryMock()

       const r = bundleRepoMock.addBundle(sameNameBundle);

       if((await r).isSuccess()){
        console.log("ES TRUE")
       }else{
        console.log("NO ES TRUE, ES FALSE")
       }



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

        const discountRepositoryMock = new DiscountMockRepository()

        discountRepositoryMock.createDiscount(discount)

        const entry: CreateBundleServiceEntryDto={

            userId: user.Id.Id,
            name: "Repeated name",
            description: "desripction of the bundle",
            images: ["image1","image2"] ,
            price: 15,
            currency: BundleCurrency.USD,
            weight: 1,
            measurement: Measurement.KG,
            stock: 5,
            category: categories.map(i=>i.Id.Value),
            productId: productos.map(i=>i.Id.Id),
            caducityDate: new Date(2026, 0, 1),// Meses en JavaScript van de 0 (enero) a 11 (diciembre),
            discount: discount.ID.Value,

        }

        const service = new CreateBundleApplicationService(
            bundleRepoMock,
            new UuidGeneratorMock(),
            new FileUploaderMock(),
            new CategoriesExistenceService(categoryRepositoryMock),
            new ProductsExistenceService(productRepositoryMock),
            new DiscountExistenceService(discountRepositoryMock)

        )

        const result = await service.execute(entry)

        const falso:boolean = false

        expect(falso).toBeFalsy()
    })

    it('should fail a new bundle if price atribute is less than 0', async () => {
        const user = await UserObjectMother.createAdminUser();
        const userRepositoryMock = new UserMockRepository();
        userRepositoryMock.saveUserAggregate(user)

        const c1 = await CategoryObjectMother.createNormalCategory('C1')
        const c2 = await CategoryObjectMother.createNormalCategory('C2')

        const p1 = await ProductObjectMother.createNormalProduct('P1')
        const p2 = await ProductObjectMother.createNormalProduct('P2')

        const discount = await DiscountObjectMother.createNormalDiscount('descuento prueba bundle')


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

        const discountRepositoryMock = new DiscountMockRepository()

        discountRepositoryMock.createDiscount(discount)

        const entry: CreateBundleServiceEntryDto={

            userId: user.Id.Id,
            name: "COMBO",
            description: "desripction of the bundle",
            images: ["image1","image2"] ,
            price: -1,
            currency: BundleCurrency.USD,
            weight: 1,
            measurement: Measurement.KG,
            stock: 5,
            category: categories.map(i=>i.Id.Value),
            productId: productos.map(i=>i.Id.Id),
            caducityDate: new Date(2026, 0, 1),// Meses en JavaScript van de 0 (enero) a 11 (diciembre),
            discount: discount.ID.Value,

        }

        const service = new CreateBundleApplicationService(
            new BundleRepositoryMock(),
            new UuidGeneratorMock(),
            new FileUploaderMock(),
            new CategoriesExistenceService(categoryRepositoryMock),
            new ProductsExistenceService(productRepositoryMock),
            new DiscountExistenceService(discountRepositoryMock)

        )

        await expect(service.execute(entry)).rejects.toThrowError(
             "El precio debe ser mayor a 0"
        );
    })

    it('should fail a new bundle if price atribute equals 0', async () => {
        const user = await UserObjectMother.createAdminUser();
        const userRepositoryMock = new UserMockRepository();
        userRepositoryMock.saveUserAggregate(user)

        const c1 = await CategoryObjectMother.createNormalCategory('C1')
        const c2 = await CategoryObjectMother.createNormalCategory('C2')

        const p1 = await ProductObjectMother.createNormalProduct('P1')
        const p2 = await ProductObjectMother.createNormalProduct('P2')

        const discount = await DiscountObjectMother.createNormalDiscount('descuento prueba bundle')


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

        const discountRepositoryMock = new DiscountMockRepository()

        discountRepositoryMock.createDiscount(discount)

        const entry: CreateBundleServiceEntryDto={

            userId: user.Id.Id,
            name: "COMBO",
            description: "desripction of the bundle",
            images: ["image1","image2"] ,
            price: 0,
            currency: BundleCurrency.USD,
            weight: 1,
            measurement: Measurement.KG,
            stock: 5,
            category: categories.map(i=>i.Id.Value),
            productId: productos.map(i=>i.Id.Id),
            caducityDate: new Date(2026, 0, 1),// Meses en JavaScript van de 0 (enero) a 11 (diciembre),
            discount: discount.ID.Value,

        }

        const service = new CreateBundleApplicationService(
            new BundleRepositoryMock(),
            new UuidGeneratorMock(),
            new FileUploaderMock(),
            new CategoriesExistenceService(categoryRepositoryMock),
            new ProductsExistenceService(productRepositoryMock),
            new DiscountExistenceService(discountRepositoryMock)

        )

        await expect(service.execute(entry)).rejects.toThrowError(
             "El precio debe ser mayor a 0"
        );
    })

    it('should fail a new bundle if currency atribute, a non-optional atribute, IS NULL', async () => {
        const user = await UserObjectMother.createAdminUser();
        const userRepositoryMock = new UserMockRepository();
        userRepositoryMock.saveUserAggregate(user)

        const c1 = await CategoryObjectMother.createNormalCategory('C1')
        const c2 = await CategoryObjectMother.createNormalCategory('C2')

        const p1 = await ProductObjectMother.createNormalProduct('P1')
        const p2 = await ProductObjectMother.createNormalProduct('P2')

        const discount = await DiscountObjectMother.createNormalDiscount('descuento prueba bundle')


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

        const discountRepositoryMock = new DiscountMockRepository()

        discountRepositoryMock.createDiscount(discount)

        const entry: CreateBundleServiceEntryDto={

            userId: user.Id.Id,
            name: "COMBO",
            description: "desripction of the bundle",
            images: ["image1","image2"] ,
            price: 5,
            currency: null,
            weight: 1,
            measurement: Measurement.KG,
            stock: 5,
            category: categories.map(i=>i.Id.Value),
            productId: productos.map(i=>i.Id.Id),
            caducityDate: new Date(2026, 0, 1),// Meses en JavaScript van de 0 (enero) a 11 (diciembre),
            discount: discount.ID.Value,

        }

        const service = new CreateBundleApplicationService(
            new BundleRepositoryMock(),
            new UuidGeneratorMock(),
            new FileUploaderMock(),
            new CategoriesExistenceService(categoryRepositoryMock),
            new ProductsExistenceService(productRepositoryMock),
            new DiscountExistenceService(discountRepositoryMock)

        )

        await expect(service.execute(entry)).rejects.toThrowError(
             "La moneda no es válida"
        );
    })

    it('should fail a new bundle if weight is less than 0', async () => {
        const user = await UserObjectMother.createAdminUser();
        const userRepositoryMock = new UserMockRepository();
        userRepositoryMock.saveUserAggregate(user)

        const c1 = await CategoryObjectMother.createNormalCategory('C1')
        const c2 = await CategoryObjectMother.createNormalCategory('C2')

        const p1 = await ProductObjectMother.createNormalProduct('P1')
        const p2 = await ProductObjectMother.createNormalProduct('P2')

        const discount = await DiscountObjectMother.createNormalDiscount('descuento prueba bundle')


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

        const discountRepositoryMock = new DiscountMockRepository()

        discountRepositoryMock.createDiscount(discount)

        const entry: CreateBundleServiceEntryDto={

            userId: user.Id.Id,
            name: "COMBO",
            description: "desripction of the bundle",
            images: ["image1","image2"] ,
            price: 5,
            currency: BundleCurrency.USD,
            weight: -1,
            measurement: Measurement.KG,
            stock: 5,
            category: categories.map(i=>i.Id.Value),
            productId: productos.map(i=>i.Id.Id),
            caducityDate: new Date(2026, 0, 1),// Meses en JavaScript van de 0 (enero) a 11 (diciembre),
            discount: discount.ID.Value,

        }

        const service = new CreateBundleApplicationService(
            new BundleRepositoryMock(),
            new UuidGeneratorMock(),
            new FileUploaderMock(),
            new CategoriesExistenceService(categoryRepositoryMock),
            new ProductsExistenceService(productRepositoryMock),
            new DiscountExistenceService(discountRepositoryMock)

        )

        await expect(service.execute(entry)).rejects.toThrowError(
             "El peso debe ser mayor a 0"
        );
    })

    it('should fail a new bundle if weight equals 0', async () => {
        const user = await UserObjectMother.createAdminUser();
        const userRepositoryMock = new UserMockRepository();
        userRepositoryMock.saveUserAggregate(user)

        const c1 = await CategoryObjectMother.createNormalCategory('C1')
        const c2 = await CategoryObjectMother.createNormalCategory('C2')

        const p1 = await ProductObjectMother.createNormalProduct('P1')
        const p2 = await ProductObjectMother.createNormalProduct('P2')

        const discount = await DiscountObjectMother.createNormalDiscount('descuento prueba bundle')


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

        const discountRepositoryMock = new DiscountMockRepository()

        discountRepositoryMock.createDiscount(discount)

        const entry: CreateBundleServiceEntryDto={

            userId: user.Id.Id,
            name: "COMBO",
            description: "desripction of the bundle",
            images: ["image1","image2"] ,
            price: 5,
            currency: BundleCurrency.USD,
            weight: 0,
            measurement: Measurement.KG,
            stock: 5,
            category: categories.map(i=>i.Id.Value),
            productId: productos.map(i=>i.Id.Id),
            caducityDate: new Date(2026, 0, 1),// Meses en JavaScript van de 0 (enero) a 11 (diciembre),
            discount: discount.ID.Value,

        }

        const service = new CreateBundleApplicationService(
            new BundleRepositoryMock(),
            new UuidGeneratorMock(),
            new FileUploaderMock(),
            new CategoriesExistenceService(categoryRepositoryMock),
            new ProductsExistenceService(productRepositoryMock),
            new DiscountExistenceService(discountRepositoryMock)

        )

        await expect(service.execute(entry)).rejects.toThrowError(
             "El peso debe ser mayor a 0"
        );
    })

    it('should fail a new bundle if stock is less than 0', async () => {
        const user = await UserObjectMother.createAdminUser();
        const userRepositoryMock = new UserMockRepository();
        userRepositoryMock.saveUserAggregate(user)

        const c1 = await CategoryObjectMother.createNormalCategory('C1')
        const c2 = await CategoryObjectMother.createNormalCategory('C2')

        const p1 = await ProductObjectMother.createNormalProduct('P1')
        const p2 = await ProductObjectMother.createNormalProduct('P2')

        const discount = await DiscountObjectMother.createNormalDiscount('descuento prueba bundle')


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

        const discountRepositoryMock = new DiscountMockRepository()

        discountRepositoryMock.createDiscount(discount)

        const entry: CreateBundleServiceEntryDto={

            userId: user.Id.Id,
            name: "COMBO",
            description: "desripction of the bundle",
            images: ["image1","image2"] ,
            price: 5,
            currency: BundleCurrency.USD,
            weight: 1,
            measurement: Measurement.KG,
            stock: -1,
            category: categories.map(i=>i.Id.Value),
            productId: productos.map(i=>i.Id.Id),
            caducityDate: new Date(2026, 0, 1),// Meses en JavaScript van de 0 (enero) a 11 (diciembre),
            discount: discount.ID.Value,

        }

        const service = new CreateBundleApplicationService(
            new BundleRepositoryMock(),
            new UuidGeneratorMock(),
            new FileUploaderMock(),
            new CategoriesExistenceService(categoryRepositoryMock),
            new ProductsExistenceService(productRepositoryMock),
            new DiscountExistenceService(discountRepositoryMock)

        )

        await expect(service.execute(entry)).rejects.toThrowError(
             "El stock no puede ser menor a 0"
        );
    })


})