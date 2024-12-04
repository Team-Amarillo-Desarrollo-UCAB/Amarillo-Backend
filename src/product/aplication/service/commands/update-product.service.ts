import { IApplicationService } from "src/common/application/application-services/application-service.interface";
import { UpdateProductServiceResponseDTO } from "../../dto/response/update-product-service-response.dto";
import { UpdateProductServiceEntryDTO } from '../../dto/entry/update-product-service-entry.dto';
import { Result } from "src/common/domain/result-handler/Result";
import { IProductRepository } from "src/product/domain/repositories/product-repository.interface";
import { ProductStock } from "src/product/domain/value-objects/product-stock";

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

        if (data.stock)
            productResult.increaseStock(ProductStock.create(data.stock))

        throw new Error("Method not implemented.");
    }

    get name(): string {
        return this.constructor.name
    }

}