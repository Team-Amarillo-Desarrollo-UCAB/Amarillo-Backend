import { IApplicationService } from "src/common/application/application-services/application-service.interface";
import { CreateProductServiceEntryDTO } from "../../dto/entry/create-product-service-entry.dto";
import { CreateProductServiceResponseDTO } from "../../dto/response/create-product-service-response.dto";
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

export class CreateProductService implements IApplicationService<CreateProductServiceEntryDTO, CreateProductServiceResponseDTO> {

    constructor(
        private readonly productRepository: IProductRepository,
        private readonly fileUploader: IFileUploader,
        private readonly idGenerator: IdGenerator<string>,
    ) {

    }

    async execute(data: CreateProductServiceEntryDTO): Promise<Result<CreateProductServiceResponseDTO>> {
        console.log(data.image)
        const image_url = await this.fileUploader.UploadFile(data.image)
        const producto = Product.create(
            ProductId.create(await this.idGenerator.generateId()),
            ProductName.create(data.nombre),
            ProductDescription.create(data.descripcion),
            ProductUnit.create(
                data.unidad_medida,
                ProductCantidadMedida.create(data.cantidad_medida)
            ),
            ProductPrice.create(
                ProductAmount.create(data.precio),
                ProductCurrency.create(data.moneda)
            ),
            ProductImage.create(image_url),
            ProductStock.create(data.stock)
        )
        const result = await this.productRepository.saveProductAggregate(producto)

        if (!result.isSuccess())
            return Result.fail(new Error("Producto no creado"), 404, "Producto no creado")

        const response: CreateProductServiceResponseDTO = {
            id_producto: producto.Id.Id,
            nombre: data.nombre,
            descripcion: data.descripcion,
            unidad_medida: data.unidad_medida,
            cantidad_medida: data.cantidad_medida,
            precio: data.precio,
            moneda: data.moneda,
            stock: data.stock
        }

        return Result.success(response, 200)
    }

    get name(): string {
        return this.constructor.name
    }

}