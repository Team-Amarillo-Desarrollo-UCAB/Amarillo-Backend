import { IApplicationService } from "src/common/application/application-services/application-service.interface";
import { Result } from "src/common/domain/result-handler/Result";
import { CreateEstadoOrdenServiceEntry } from "../DTO/entry/create-estado-orden-entry.dto";
import { CreateEstadoOrdenServiceResponseDTO } from "../DTO/response/create-estado-orden-service-response.dto";
import { EstadoOrdenRepository } from "../../repositories/estado_orden.repository";
import { EstadoRepository } from "../../repositories/estado.repository";
import { Estado_Orden } from "../../entites/Estado-orden/estado_orden.entity";
import { OrderRepository } from "../../repositories/order-repository";
import { IOrderRepository } from "src/order/domain/repositories/order-repository.interface";
import { OrderMapper } from "../../mappers/order-mapper";

export class CreateEstadoOrdenService implements IApplicationService
<CreateEstadoOrdenServiceEntry,
CreateEstadoOrdenServiceResponseDTO>{

    private readonly ordenMapper: OrderMapper

    constructor(
        private readonly estadoOrdenRepository: EstadoOrdenRepository,
        private readonly estadoRepository: EstadoRepository,
        private readonly ordenRepository: IOrderRepository,
        
    ){
        this.ordenMapper = new OrderMapper()
    }

    async execute(data: CreateEstadoOrdenServiceEntry): Promise<Result<CreateEstadoOrdenServiceResponseDTO>> {

        const estado = await this.estadoRepository.findByName(data.estado)
        console.log("estado:",estado.Value)
        
        if(!estado.isSuccess())
            return Result.fail(estado.Error,estado.StatusCode,estado.Message)

        const orden = await this.ordenRepository.findOrderById(data.id_orden)

        if(!orden.isSuccess())
            return Result.fail(estado.Error,estado.StatusCode,estado.Message)

        console.log("orden:",orden)

        const estado_orden = Estado_Orden.create(
            data.id_orden,
            estado.Value.id,
            data.fecha_inicio,
            null
        )

        console.log("Estado_orden: ",estado_orden)

        const result = await this.estadoOrdenRepository.saveEstadoOrden(estado_orden)
        
        if(!result.isSuccess()){
            console.log("Fallo en el save")
            return Result.fail(result.Error,result.StatusCode,result.Message)
        }

        return Result.success({id: data.id_orden},200)
    }

    get name(): string {
        return this.constructor.name
    }

}