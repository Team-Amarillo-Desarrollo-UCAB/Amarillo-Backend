import { IApplicationService } from "src/common/application/application-services/application-service.interface";
import { Result } from "src/common/domain/result-handler/Result";
import { IProductRepository } from "src/product/domain/repositories/product-repository.interface";
import { GetProductByNameServiceEntryDTO } from "../../DTO/entry/get-product-by-name-service-entry.dto";
import { GetProductByNameServiceResponseDTO } from "../../DTO/response/get-product-by-name-service-response.dto";

export class GetProductByNameService implements IApplicationService<GetProductByNameServiceEntryDTO, GetProductByNameServiceResponseDTO> {

    private readonly productRepository: IProductRepository

    constructor(productRepository: IProductRepository) {
        this.productRepository = productRepository
    }

    async execute(data: GetProductByNameServiceEntryDTO): Promise<Result<GetProductByNameServiceResponseDTO>> {

        const producto = await this.productRepository.findProductByName(data.name)

        console.log("producto encontrado: ",producto.Value)

        if (!producto.isSuccess())
            return Result.fail(new Error("Producto no encontrado"), 404, "Producto no encontrado")

        const response: GetProductByNameServiceResponseDTO = {
            id_producto: producto.Value.Id.Id,
            nombre: producto.Value.Name,
            precio: producto.Value.Price,
            moneda: producto.Value.Moneda,
            stock: producto.Value.Stock,
            unidad_medida: producto.Value.Unit,
            cantidad_medida: producto.Value.CantidadMedida,
            descripcion: producto.Value.Description,
            images: producto.Value.Images ? producto.Value.Images.map(i => i.Image): [],
            caducityDate: producto.Value.ProductCaducityDate ? producto.Value.ProductCaducityDate.Value : new Date('2029-01-01'),
            category: producto.Value.Categories ? producto.Value.Categories.map(i=>i.Value) : [],
            discount: producto.Value.Discount ? producto.Value.Discount.Value : "",
        }

        return Result.success(response,202)
    }

    get name(): string {
        return this.constructor.name
    }

}