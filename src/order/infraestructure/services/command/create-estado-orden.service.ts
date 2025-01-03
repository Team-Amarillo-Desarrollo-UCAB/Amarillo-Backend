import { IApplicationService } from "src/common/application/application-services/application-service.interface"
import { Result } from "src/common/domain/result-handler/Result"
import { IOrderRepository } from "src/order/domain/repositories/order-repository.interface"
import { Estado_Orden } from "src/order/infraestructure/entites/Estado-orden/estado_orden.entity"
import { OrderMapper } from "src/order/infraestructure/mappers/order-mapper"
import { EstadoRepository } from "src/order/infraestructure/repositories/estado.repository"
import { EstadoOrdenRepository } from "src/order/infraestructure/repositories/estado_orden.repository"
import { CreateEstadoOrdenServiceEntry } from "src/order/infraestructure/services/DTO/entry/create-estado-orden-entry.dto"
import { CreateEstadoOrdenServiceResponseDTO } from "src/order/infraestructure/services/DTO/response/create-estado-orden-service-response.dto" 


export class CreateEstadoOrdenService implements IApplicationService
    <CreateEstadoOrdenServiceEntry,
        CreateEstadoOrdenServiceResponseDTO> {

    private readonly ordenMapper: OrderMapper

    constructor(
        private readonly estadoOrdenRepository: EstadoOrdenRepository,
        private readonly estadoRepository: EstadoRepository,
        private readonly ordenRepository: IOrderRepository,
        private ordenMappe: OrderMapper

    ) {
        this.ordenMapper = ordenMappe
    }

    async execute(data: CreateEstadoOrdenServiceEntry): Promise<Result<CreateEstadoOrdenServiceResponseDTO>> {

        const estado = await this.estadoRepository.findByName(data.estado)

        if (!estado.isSuccess())
            return Result.fail(estado.Error, estado.StatusCode, estado.Message)

        const orden = await this.ordenRepository.findOrderById(data.id_orden)

        if (!orden.isSuccess())
            return Result.fail(estado.Error, estado.StatusCode, estado.Message)

        const estado_orden = Estado_Orden.create(
            data.id_orden,
            estado.Value.id,
            data.fecha_inicio,
            null
        )

        const result = await this.estadoOrdenRepository.saveEstadoOrden(estado_orden)

        if (!result.isSuccess()) {
            console.log("Fallo en el save")
            return Result.fail(result.Error, result.StatusCode, result.Message)
        }

        return Result.success({ id: data.id_orden }, 200)
    }

    get name(): string {
        return this.constructor.name
    }

}