import { CategoriesExistenceService } from "src/common/application/application-services/common-services/categories-existence-check.service";
import { Category } from "src/category/domain/category.entity";
import { DiscountExistenceService } from "src/common/application/application-services/common-services/discount-existence-check.service";
import { CreateProductServiceEntryDTO } from "src/product/aplication/DTO/entry/create-product-service-entry.dto";
import { CreateProductService } from "src/product/aplication/service/commands/create-product.service";
import { Moneda } from "src/product/domain/enum/Monedas";
import { UnidadMedida } from "src/product/domain/enum/UnidadMedida";
import { CategoryObjectMother } from "test/common/objects-mock/category.object-mother";
import { DiscountObjectMother } from "test/common/objects-mock/discount.object-mother";
import { UserObjectMother } from "test/common/objects-mock/user.object-mother";
import { UuidGeneratorMock } from "test/common/other-mock/uuid-generator.mock";
import { CategoryMockRepository } from "test/common/repository-mock/category-repository.mock";
import { DiscountMockRepository } from "test/common/repository-mock/discount-repository.mock";
import { EventHandlerMock } from "test/common/repository-mock/event-handler.mock";
import { ProductRepositoryMock } from "test/common/repository-mock/product-repository.mock";
import { UserMockRepository } from "test/common/repository-mock/user-repository-mock";
import { FileUploaderMock } from "test/common/other-mock/file-uploader.mock";

describe('Create product', () => {

    it('should create a new product', async () => {
        const user = await UserObjectMother.createAdminUser();
        const userRepositoryMock = new UserMockRepository();
        userRepositoryMock.saveUserAggregate(user)

        const c1 = await CategoryObjectMother.createNormalCategory('C1')
        const c2 = await CategoryObjectMother.createNormalCategory('C2')

        const discount = await DiscountObjectMother.createNormalDiscount('descuento prueba producto')


        const categoryRepositoryMock = new CategoryMockRepository();


        categoryRepositoryMock.createCategory(c1)
        categoryRepositoryMock.createCategory(c2)

        const categories: Category[] = []

        categories.push(c1)
        categories.push(c2)

        const discountRepositoryMock = new DiscountMockRepository()

        discountRepositoryMock.createDiscount(discount)

        const entry: CreateProductServiceEntryDTO={

            userId: user.Id.Id,
            name: "Producto test",
            description: "desripction of the product",
            images: ["image1","image2"] ,
            price: 15,
            currency: Moneda.USD,
            weight: 1,
            measurement: UnidadMedida.KG,
            stock: 5,
            category: categories.map(i=>i.Id.Value),
            caducityDate: new Date(2026, 0, 1),// Meses en JavaScript van de 0 (enero) a 11 (diciembre),
            discount: discount.ID.Value,

        }

        const service = new CreateProductService(
            new ProductRepositoryMock(),
            categoryRepositoryMock,
            new FileUploaderMock(),
            new UuidGeneratorMock(),
            new EventHandlerMock(),
            new CategoriesExistenceService(categoryRepositoryMock),
            new DiscountExistenceService(discountRepositoryMock)

        )

        const result = await service.execute(entry)

        expect(result.isSuccess()).toBeTruthy();
    })

    it('should fail if Category does not exists', async () => {
        const user = await UserObjectMother.createNormalUser();
        const userRepositoryMock = new UserMockRepository();
        userRepositoryMock.saveUserAggregate(user);

        const c1 = await CategoryObjectMother.createNormalCategory('C1')
        const c2 = await CategoryObjectMother.createNormalCategory('C2')
        const cNot = await CategoryObjectMother.createNormalCategory('C_NOT')

        const discount = await DiscountObjectMother.createNormalDiscount('descuento prueba producto')


        const categoryRepositoryMock = new CategoryMockRepository();


        categoryRepositoryMock.createCategory(c1)
        categoryRepositoryMock.createCategory(c2)

        const categories: Category[] = []

        categories.push(c1)
        categories.push(cNot)

        const discountRepositoryMock = new DiscountMockRepository()

        discountRepositoryMock.createDiscount(discount)

        const entry: CreateProductServiceEntryDTO={

            userId: user.Id.Id,
            name: "Producto test",
            description: "desripction of the product",
            images: ["image1","image2"] ,
            price: 15,
            currency: Moneda.USD,
            weight: 1,
            measurement: UnidadMedida.KG,
            stock: 5,
            category: categories.map(i=>i.Id.Value),
            caducityDate: new Date(2026, 0, 1),// Meses en JavaScript van de 0 (enero) a 11 (diciembre),
            discount: discount.ID.Value,

        }

        const service = new CreateProductService(
            new ProductRepositoryMock(),
            categoryRepositoryMock,
            new FileUploaderMock(),
            new UuidGeneratorMock(),
            new EventHandlerMock(),
            new CategoriesExistenceService(categoryRepositoryMock),
            new DiscountExistenceService(discountRepositoryMock)

        )


        const result = await service.execute(entry)

        expect(result.isSuccess()).toBeFalsy()
                
    })

    it('should fail if Discount does not exist', async () => {
        const user = await UserObjectMother.createNormalUser();
        const userRepositoryMock = new UserMockRepository();
        userRepositoryMock.saveUserAggregate(user);

        const c1 = await CategoryObjectMother.createNormalCategory('C1');
        const c2 = await CategoryObjectMother.createNormalCategory('C2');

        const discount = await DiscountObjectMother.createNormalDiscount('descuento prueba producto')

        const discountRepositoryMock = new DiscountMockRepository();

        discountRepositoryMock.createDiscount(discount)

        const notPersistedDiscount = await DiscountObjectMother.createNormalDiscount('descuento no persistido')


        const categoryRepositoryMock = new CategoryMockRepository();
        categoryRepositoryMock.createCategory(c1);
        categoryRepositoryMock.createCategory(c2);

        const categories: Category[] = [];
        categories.push(c1);
        categories.push(c2);

        const entry: CreateProductServiceEntryDTO = {
            userId: user.Id.Id,
            name: "Producto test",
            description: "desripction of the product",
            images: ["image1", "image2"],
            price: 15,
            currency: Moneda.USD,
            weight: 1,
            measurement: UnidadMedida.KG,
            stock: 5,
            category: categories.map(i => i.Id.Value),
            caducityDate: new Date(2026, 0, 1),
            discount: notPersistedDiscount.Id.Value,
        };

        const service = new CreateProductService(
            new ProductRepositoryMock(),
            categoryRepositoryMock,
            new FileUploaderMock(),
            new UuidGeneratorMock(),
            new EventHandlerMock(),
            new CategoriesExistenceService(categoryRepositoryMock),
            new DiscountExistenceService(discountRepositoryMock)
        );

        const result = await service.execute(entry);

        expect(result.isSuccess()).toBeFalsy();
    });

    it('should fail if caducityDate is in the past', async () => {
        const user = await UserObjectMother.createNormalUser();
        const userRepositoryMock = new UserMockRepository();
        userRepositoryMock.saveUserAggregate(user);

        const c1 = await CategoryObjectMother.createNormalCategory('C1');
        const c2 = await CategoryObjectMother.createNormalCategory('C2');

        const discount = await DiscountObjectMother.createNormalDiscount('descuento prueba producto');

        const categoryRepositoryMock = new CategoryMockRepository();
        categoryRepositoryMock.createCategory(c1);
        categoryRepositoryMock.createCategory(c2);

        const categories: Category[] = [];
        categories.push(c1);
        categories.push(c2);

        const discountRepositoryMock = new DiscountMockRepository();
        discountRepositoryMock.createDiscount(discount);

        const entry: CreateProductServiceEntryDTO = {
            userId: user.Id.Id,
            name: "Producto test",
            description: "desripction of the product",
            images: ["image1", "image2"],
            price: 15,
            currency: Moneda.USD,
            weight: 1,
            measurement: UnidadMedida.KG,
            stock: 5,
            category: categories.map(i => i.Id.Value),
            caducityDate: new Date(2020, 0, 1),
            discount: discount.ID.Value,
        };

        const service = new CreateProductService(
            new ProductRepositoryMock(),
            categoryRepositoryMock,
            new FileUploaderMock(),
            new UuidGeneratorMock(),
            new EventHandlerMock(),
            new CategoriesExistenceService(categoryRepositoryMock),
            new DiscountExistenceService(discountRepositoryMock)
        );

        
         await expect(service.execute(entry)).rejects.toThrowError(
            "La fecha de caducidad no puede ser una fecha pasada."
        );

        // const result = await service.execute(entry);


        // expect(result.isSuccess()).toBeFalsy();
    });

    it('should fail if a required field (name) is empty', async () => {
        const user = await UserObjectMother.createNormalUser();
        const userRepositoryMock = new UserMockRepository();
        userRepositoryMock.saveUserAggregate(user);

        const c1 = await CategoryObjectMother.createNormalCategory('C1');
        const c2 = await CategoryObjectMother.createNormalCategory('C2');

        const discount = await DiscountObjectMother.createNormalDiscount('descuento prueba producto');

        const categoryRepositoryMock = new CategoryMockRepository();
        categoryRepositoryMock.createCategory(c1);
        categoryRepositoryMock.createCategory(c2);

        const categories: Category[] = [];
        categories.push(c1);
        categories.push(c2);

        const discountRepositoryMock = new DiscountMockRepository();
        discountRepositoryMock.createDiscount(discount);

        const entry: CreateProductServiceEntryDTO = {
            userId: user.Id.Id,
            name: "",
            description: "desripction of the product",
            images: ["image1", "image2"],
            price: 15,
            currency: Moneda.USD,
            weight: 1,
            measurement: UnidadMedida.KG,
            stock: 5,
            category: categories.map(i => i.Id.Value),
            caducityDate: new Date(2026, 0, 1),
            discount: discount.ID.Value,
        };

        const service = new CreateProductService(
            new ProductRepositoryMock(),
            categoryRepositoryMock,
            new FileUploaderMock(),
            new UuidGeneratorMock(),
            new EventHandlerMock(),
            new CategoriesExistenceService(categoryRepositoryMock),
            new DiscountExistenceService(discountRepositoryMock)
        );

        // const result = await service.execute(entry);

        // expect(result.isSuccess()).toBeFalsy();

        await expect(service.execute(entry)).rejects.toThrowError(
            'El nombre del producto no puede ser vacío'
        );
    });


})