import { IdGenerator } from "src/common/application/id-generator/id-generator.interface";
import { IApplicationService } from "src/common/application/application-services/application-service.interface"
import { Result } from "src/common/domain/result-handler/Result"
import { Detalle_Orden } from "../../entites/detalle_orden.entity"
import { DetalleRepository } from "../../repositories/detalle_orden.respoitory"
import { CreateDetalleServiceEntry } from "../DTO/entry/create-detalle-service-entry"
import { CreateDetalleServiceResponseDTO } from "../DTO/response/create-detalle-service-response.dto"
import { IOrderRepository } from "src/order/domain/repositories/order-repository.interface";
import { IProductRepository } from "src/product/domain/repositories/product-repository.interface";
import { IBundleRepository } from "src/bundle/domain/repositories/bundle-repository.interface";
import { ProductMapper } from "src/product/infraestructure/mappers/product-mapper";
import { Bundle } from "src/bundle/domain/bundle.entity";
import { BundleMapper } from "src/bundle/infraestructure/mappers/bundle-mapper";


export class CreateDetalleService implements IApplicationService
    <CreateDetalleServiceEntry,
        CreateDetalleServiceResponseDTO> {

    private readonly comboMapper: BundleMapper

    constructor(
        private readonly detalleRepository: DetalleRepository,
        private readonly ordenRepository: IOrderRepository,
        private readonly productoRepository: IProductRepository,
        private readonly comboRepository: IBundleRepository,

        private readonly productoMapper: ProductMapper,

        private readonly idGenerator: IdGenerator<string>
    ) {
        this.comboMapper = new BundleMapper()
    }

    async execute(data: CreateDetalleServiceEntry): Promise<Result<CreateDetalleServiceResponseDTO>> {

        for (const d of data.detalle_productos) {

            const producto = await this.productoRepository.findProductById(d.id_producto)

            const detalle_productos = Detalle_Orden.create(
                await this.idGenerator.generateId(),
                d.cantidad,
                data.id_orden,
                producto.Value.Id.Id,
                null,
                await this.productoMapper.fromDomainToPersistence(producto.Value)
            )

            console.log("Detalle de producto: ", detalle_productos)

            const result = await this.detalleRepository.saveDetalle(detalle_productos)

            if (!result.isSuccess())
                return Result.fail(new Error("Detalle de productos no creado"), 404, "Detalle de productos no creado")

        }

        for (const d of data.detalle_combos) {

            const combo = await this.comboRepository.findBundleById(d.id_combo)
            console.log("Combo encontrado: ",combo)
            const detalle_combos = Detalle_Orden.create(
                await this.idGenerator.generateId(),
                d.cantidad,
                data.id_orden,
                null,
                d.id_combo,
                undefined,
                undefined
            )

            console.log("Detalle de combo: ", detalle_combos)

            const result = await this.detalleRepository.saveDetalle(detalle_combos)

            console.log("Guardado")

            if (!result.isSuccess())
                return Result.fail(new Error("Detalle de productos no creado"), 404, "Detalle de productos no creado")

        }

        const response: CreateDetalleServiceResponseDTO = {
            id: data.id_orden
        }

        return Result.success(response, 200)
    }

    get name(): string {
        return this.constructor.name
    }

}