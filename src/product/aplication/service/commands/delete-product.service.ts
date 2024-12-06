import { IApplicationService } from "src/common/application/application-services/application-service.interface"
import { DeleteProductServiceEntryDTO } from "src/product/aplication/dto//entry/delete-product-service-entry.dto"
import { DeleteProductServiceResponseDTO } from "src/product/aplication/dto/response/delete-product-service-response.dto"
import { IProductRepository } from "src/product/domain/repositories/product-repository.interface"
import { Result } from "src/common/domain/result-handler/Result"

export class DeleteProductService implements IApplicationService<DeleteProductServiceEntryDTO, DeleteProductServiceResponseDTO> {

    constructor(
        private readonly productRepository: IProductRepository
    ) {

    }

    async execute(data: DeleteProductServiceEntryDTO): Promise<Result<DeleteProductServiceResponseDTO>> {
        const result = await this.productRepository.deleteProduct(data.id_product)

        if (!result.isSuccess())
            return Result.fail(new Error("Eliminacion fallida"), 404, "Eliminacion fallida")

        const response: DeleteProductServiceResponseDTO = {
            id_product: data.id_product
        }

        return Result.success(response, 200)
    }

    get name(): string {
        return this.constructor.name
    }

}