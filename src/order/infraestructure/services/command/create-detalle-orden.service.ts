import { IApplicationService } from "src/common/application/application-services/application-service.interface"
import { Result } from "src/common/domain/result-handler/Result"
import { Detalle_Orden } from "../../entites/detalle_orden.entity"
import { DetalleRepository } from "../../repositories/detalle_orden.respoitory"
import { CreateDetalleServiceEntry } from "../dto/entry/create-detalle-service-entry"
import { CreateDetalleServiceResponseDTO } from "../dto/response/create-detalle-service-response.dto"


export class CreateDetalleService implements IApplicationService
<CreateDetalleServiceEntry,
CreateDetalleServiceResponseDTO>{

    constructor(
        private readonly detalleRepository: DetalleRepository,
    ){
    }

    async execute(data: CreateDetalleServiceEntry): Promise<Result<CreateDetalleServiceResponseDTO>> {

        for(const d of data.detalle_info){
            const detalle = Detalle_Orden.create(
                d.id_detalle,
                d.cantidad,
                data.id_orden,
                d.id_producto,
            )

            const result = await this.detalleRepository.saveDetalle(detalle)

            if (!result.isSuccess())
                return Result.fail(new Error("Detalle no creado"), 404, "Detalle no creado")

        }

        const response: CreateDetalleServiceResponseDTO = {
            id: data.id_orden
        }

        return Result.success(response,200)
    }

    get name(): string {
        return this.constructor.name
    }

}