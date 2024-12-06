import { IApplicationService } from "src/common/application/application-services/application-service.interface";
import { UpdateProductServiceResponseDTO } from "../../DTO/response/update-product-service-response.dto";
import { UpdateProductServiceEntryDTO } from '../../DTO/entry/update-product-service-entry.dto';
import { Result } from "src/common/domain/result-handler/Result";
import { IProductRepository } from "src/product/domain/repositories/product-repository.interface";
import { ProductStock } from "src/product/domain/value-objects/product-stock";
import { ProductDescription } from "src/product/domain/value-objects/product-description";
import { ProductName } from "src/product/domain/value-objects/product-name";

export class UpdateProductService implements IApplicationService
    <UpdateProductServiceEntryDTO, UpdateProductServiceResponseDTO> {

    constructor(
        private readonly productRepository: IProductRepository
    ) { }

    async execute(data: UpdateProductServiceEntryDTO): Promise<Result<UpdateProductServiceResponseDTO>> {

        data.name
            ? this.productRepository.verifyNameProduct(data.name)
            : null

        const product = await this.productRepository.findProductById(data.userId)
        if (!product.isSuccess()) return Result.fail<UpdateProductServiceResponseDTO>(product.Error, product.StatusCode, product.Message)
        const productResult = product.Value
        productResult.pullEvents()

        if(data.name){
            const verify = await this.productRepository.verifyNameProduct(data.name)
            if(!verify.isSuccess())
                return Result.fail(new Error('Nombre del producto ya registrado'),404,'Nombre del producto ya registrado')
            productResult.modifiedName(ProductName.create(data.name))
        }

        if(data.description)
            productResult.modifiedDescription(ProductDescription.create(data.description))

        if (data.stock)
            productResult.increaseStock(ProductStock.create(data.stock))

        const result = await this.productRepository.saveProductAggregate(productResult)

        if(!result.isSuccess())
            return Result.fail<UpdateProductServiceResponseDTO>(new Error("Producto no modificado"),result.StatusCode,'Producto no modificado')

        const response: UpdateProductServiceResponseDTO = {
            id_producto: result.Value.Id.Id
        }

        return Result.success<UpdateProductServiceResponseDTO>(response,200)
    }

    get name(): string {
        return this.constructor.name
    }

}