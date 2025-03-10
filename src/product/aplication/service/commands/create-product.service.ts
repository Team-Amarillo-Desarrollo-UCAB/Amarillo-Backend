import { IApplicationService } from "src/common/application/application-services/application-service.interface";
import { CreateProductServiceEntryDTO } from "../../DTO/entry/create-product-service-entry.dto";
import { CreateProductServiceResponseDTO } from "../../DTO/response/create-product-service-response.dto";
import { Result } from "src/common/domain/result-handler/Result";
import { IProductRepository } from "src/product/domain/repositories/product-repository.interface";
import { IdGenerator } from "src/common/application/id-generator/id-generator.interface";
import { Product } from "src/product/domain/product";
import { ProductId } from "src/product/domain/value-objects/product-id";
import { ProductName } from "src/product/domain/value-objects/product-name";
import { ProductDescription } from "src/product/domain/value-objects/product-description";
import { ProductUnit } from "src/product/domain/value-objects/product-unit/product-unit";
import { ProductPrice } from "src/product/domain/value-objects/product-precio/product-price";
import { ProductImage } from "src/product/domain/value-objects/product-image";
import { ProductStock } from "src/product/domain/value-objects/product-stock";
import { ProductCantidadMedida } from "src/product/domain/value-objects/product-unit/product-cantidad-medida";
import { ProductCurrency } from "src/product/domain/value-objects/product-precio/product-currency";
import { ProductAmount } from "src/product/domain/value-objects/product-precio/product-amount";
import { IFileUploader } from "src/common/application/file-uploader/file-uploader.interface";
import { IEventHandler } from "src/common/application/event-handler/event-handler.interface";
import { ICategoryRepository } from "src/category/domain/repositories/category-repository.interface";
import { CategoryID } from "src/category/domain/value-objects/category-id";
import { CategoriesExistenceService } from "src/common/application/application-services/common-services/categories-existence-check.service";
import { DiscountExistenceService } from "src/common/application/application-services/common-services/discount-existence-check.service";
import { DiscountID } from "src/discount/domain/value-objects/discount-id";
import { ProductCaducityDate } from "src/product/domain/value-objects/productCaducityDate";
import { ProductWeight } from "src/product/domain/value-objects/product-weight";
import { Product3DImage } from "src/product/domain/value-objects/product-3d-image";

export class CreateProductService implements IApplicationService<CreateProductServiceEntryDTO, CreateProductServiceResponseDTO> {

    constructor(
        private readonly productRepository: IProductRepository,
        private readonly categoryRepository: ICategoryRepository,
        private readonly fileUploader: IFileUploader,
        private readonly idGenerator: IdGenerator<string>,
        private readonly eventBus: IEventHandler,
        private readonly categorieExistenceService: CategoriesExistenceService,
        private readonly discountExistenceService: DiscountExistenceService
    ) {

    }

    async execute(data: CreateProductServiceEntryDTO): Promise<Result<CreateProductServiceResponseDTO>> {

        const iconUrls = await Promise.all(
            data.images.map(async (image) => {
                return this.fileUploader.UploadFile(image); // Subir cada imagen individualmente
            })
        );

        const productImages = iconUrls.map((url) => ProductImage.create(url));

        let image3d = null

        if(data.image3d){
           const ima3d = await this.fileUploader.UploadFile(data.image3d)
           image3d = Product3DImage.create(ima3d)
        }
        

        // let categorias: CategoryID[] = []

        // if (data.category) {
        //     for (const categoria of data.category) {
        //         const category = await this.categoryRepository.findCategoryById(categoria)
        //         if (!category.isSuccess()) {
        //             return Result.fail<CreateProductServiceResponseDTO>(category.Error, category.StatusCode, category.Message)
        //         }
        //         categorias.push(category.Value.Id)
        //     }
        // }

        // Validar la existencia de las categorías
        const categoryResult = await this.categorieExistenceService.categoriesExistenceCheck(data.category);


        if (!categoryResult.isSuccess()) {
            return Result.fail(categoryResult.Error, categoryResult.StatusCode, categoryResult.Message);
        }

        const discountResult = await this.discountExistenceService.discountExistenceCheck(data.discount);

        if (data.discount) {

            if (!discountResult.isSuccess()) {
                return Result.fail(discountResult.Error, discountResult.StatusCode, discountResult.Message);
            }
        }

        const producto = Product.create(
            ProductId.create(await this.idGenerator.generateId()),
            ProductName.create(data.name),
            ProductDescription.create(data.description),
            ProductUnit.create(
                data.measurement,
                ProductCantidadMedida.create(data.weight)
            ),



            productImages,
            ProductStock.create(data.stock),
            ProductPrice.create(
                ProductAmount.create(data.price),
                ProductCurrency.create(data.currency)
            ),
            categoryResult.Value,
            discountResult.Value ? DiscountID.create(data.discount) : null,
            data.caducityDate ? ProductCaducityDate.create(data.caducityDate) : null,
            data.image3d ? Product3DImage.create(image3d) : null

        )
        const result = await this.productRepository.saveProductAggregate(producto)

        if (!result.isSuccess())
            return Result.fail(new Error("Producto no creado"), 404, "Producto no creado")

        const response: CreateProductServiceResponseDTO = {
            id_producto: producto.Id.Id,
            nombre: data.name,
            descripcion: data.description,
            unidad_medida: data.measurement,
            cantidad_medida: data.weight,
            precio: data.price,
            moneda: data.currency,
            stock: data.stock,
            category: producto.Categories.map((category) => category.Value) ?? null,
            images: producto.Images.map((image) => image.Image),
            caducityDate: data.caducityDate ?? null,
            discount: data.discount ?? null,
            image3d: image3d
        }

        await this.eventBus.publish(producto.pullEvents())

        return Result.success(response, 200)
    }

    get name(): string {
        return this.constructor.name
    }

}