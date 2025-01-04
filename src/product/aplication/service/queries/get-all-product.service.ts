import { IApplicationService } from "src/common/application/application-services/application-service.interface"
import { IProductRepository } from "src/product/domain/repositories/product-repository.interface"
import { GetAllProductServiceEntryDTO } from "../../DTO/entry/get-all-product-service-entry.dto"
import { Result } from "src/common/domain/result-handler/Result"
import { GetAllProductServiceResponseDTO } from "../../DTO/response/get-all-product-service.response"


export class GetAllProductService implements IApplicationService<GetAllProductServiceEntryDTO, GetAllProductServiceResponseDTO[]> {

    private readonly productRepository: IProductRepository

    constructor(productRepository: IProductRepository) {
        this.productRepository = productRepository
    }

    async execute(data: GetAllProductServiceEntryDTO): Promise<Result<GetAllProductServiceResponseDTO[]>> {
        // console.log("Valor de page antes del calculo:",data.page)
        // console.log("Valor de perpage antes del calculo:",data.perpage)


        // data.page = data.page * data.perpage - data.perpage;

        // console.log("Valor de page despues del calculo:",data.page)
        // console.log("Valor de perpage despues del calculo:",data.perpage)

        const products = await this.productRepository.findAllProducts(data.page, data.perpage, data.category, data.name, data.price, data.popular, data.discount)



        if (!products.isSuccess){
            console.log("ENTRAMOS AL IF DE PRODUCTRESULT")

            return Result.fail(new Error("ERROR al hallar"),500,"ERROR al hallar");
        }

        const response: GetAllProductServiceResponseDTO[] = []


            await Promise.all(
                products.Value.map(async (producto) => {
                    response.push({
                        id_product: producto.Id?.Id || null,
                        nombre: producto.Name || "",
                        precio: producto.Price || 0,
                        moneda: producto.Moneda || "",
                        stock: producto.Stock || 0,
                        unidad_medida: producto.Unit || "",
                        cantidad_medida: producto.CantidadMedida || 0,
                        descripcion: producto.Description || "",
                        images: producto.Images ? producto.Images.map(i => i.Image) : [],
                        caducityDate: producto.ProductCaducityDate ? producto.ProductCaducityDate.Value : new Date('2029-01-01'),
                        category: producto.Categories ? producto.Categories.map(i => i.Value) : [],
                        discount: producto.Discount ? producto.Discount.Value : "",
                    });
                })
            );

        

        return Result.success(response, 202)
    }

    get name(): string {
        return this.constructor.name
    }
}