import { IApplicationService } from "src/common/application/application-services/application-service.interface";
import { GetAllOrdersServiceEntryDTO } from "../../DTO/entry/get-all-orders-entry-service.dto";
import { GetAllOrdersServiceResponseDTO } from "../../DTO/response/get-all-orders-service-service.dto";
import { Result } from "src/common/domain/result-handler/Result";
import { IOrderRepository } from "src/order/domain/repositories/order-repository.interface";
import { Order } from "src/order/domain/order";

export class GetAllOrdersService implements
    IApplicationService<GetAllOrdersServiceEntryDTO, GetAllOrdersServiceResponseDTO[]> {

    constructor(
        private readonly orderRepository: IOrderRepository
    ) { }

    async execute(data: GetAllOrdersServiceEntryDTO): Promise<Result<GetAllOrdersServiceResponseDTO[]>> {

        const ordenes = await this.orderRepository.findAllOrders(data.page, data.limit)

        if(!ordenes.isSuccess())
            return Result.fail<GetAllOrdersServiceResponseDTO[]>(ordenes.Error,ordenes.StatusCode,ordenes.Message)

        const response: GetAllOrdersServiceResponseDTO[] = []

        for(const orden of ordenes.Value){

            response.push({
                id_orden: orden.Id.Id,
                estado: orden.Estado.Estado,
                productos: orden.Productos.map((p) => {
                    return {
                        id_producto: p.Id.Id,
                        nombre_producto: p.Name().Value,
                        cantidad_producto: p.Cantidad().Value
                    }
                }),
                monto_total: orden.Monto.Total,
                fecha_creacion: orden.Fecha_creacion.Date_creation
            })

        }

        return Result.success<GetAllOrdersServiceResponseDTO[]>(response,200)
    }

    get name(): string {
        return this.constructor.name
    }



}