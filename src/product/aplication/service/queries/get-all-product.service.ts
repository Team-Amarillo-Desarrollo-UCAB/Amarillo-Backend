import { IApplicationService } from "src/common/application/application-services/application-service.interface"
import { IProductRepository } from "src/product/domain/repositories/product-repository.interface"
import { GetAllProductServiceEntryDTO } from "../../dto/entry/get-all-product-service-entry.dto"
import { Result } from "src/common/domain/result-handler/Result"
import { GetAllProductServiceResponseDTO } from "../../dto/entry/response/get-all-product-service.response"
import { UnidadMedida } from "src/product/domain/enum/UnidadMedida"

export class GetAllProductService implements IApplicationService<GetAllProductServiceEntryDTO, GetAllProductServiceResponseDTO[]> {

    private readonly productRepository: IProductRepository

    constructor(productRepository: IProductRepository) {
        this.productRepository = productRepository
    }

    async execute(data: GetAllProductServiceEntryDTO): Promise<Result<GetAllProductServiceResponseDTO[]>> {
        data.page = data.page * data.limit - data.limit;

        const products = await this.productRepository.findAllProducts(data.page, data.limit)

        if (!products.isSuccess)
            throw new Error("Method not implemented.")

        const response: GetAllProductServiceResponseDTO[] = []

        products.Value.map(
            async (producto) => {
                response.push({
                    id_product: producto.Id.Id,
                    nombre: producto.Name,
                    precio: producto.Price,
                    moneda: producto.Moneda,
                    stock: producto.Stock,
                    image: producto.Image,
                    unidad_medida: producto.Unit,
                    cantidad_medida: producto.CantidadMedida,
                    descripcion: producto.Description
                })
            }
        )

        return Result.success(response, 202)
    }

    get name(): string {
        return this.constructor.name
    }
}