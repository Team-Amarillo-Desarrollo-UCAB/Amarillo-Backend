import { IApplicationService } from "src/common/application/application-services/application-service.interface";
import { Result } from "src/common/domain/result-handler/Result";
import { IOrderRepository } from "src/order/domain/repositories/order-repository.interface";
import { UserId } from "src/user/domain/value-object/user-id";
import { GetAllOrdersServiceResponseDTO } from "../../DTO/response/get-all-orders-service-service.dto";
import { GetActiveOrdersServiceEntryDTO } from "../../DTO/entry/get-active-orders-service-entry.dto";

export class GetActiveOrdersService implements IApplicationService<GetActiveOrdersServiceEntryDTO, GetAllOrdersServiceResponseDTO[]> {

    constructor(
        private readonly orderRepository: IOrderRepository
    ) {

    }

    async execute(data: GetActiveOrdersServiceEntryDTO): Promise<Result<GetAllOrdersServiceResponseDTO[]>> {

        const find_orders = await this.orderRepository.findAllActiveOrdersByUser(UserId.create(data.userId))

        if (!find_orders.isSuccess())
            return Result.fail(find_orders.Error, find_orders.StatusCode, find_orders.Message)


        const response: GetAllOrdersServiceResponseDTO[] = []

        for (const orden of find_orders.Value) {

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
                combos: orden.Bundles.map((c) => {
                    return {
                        id_combo: c.Id.Value,
                        nombre_combo: c.Name().Value,
                        cantidad_combo: c.Cantidad().Value
                    }
                }),
                monto_total: orden.Monto.Total,
                fecha_creacion: orden.Fecha_creacion.Date_creation
            })

        }

        return Result.success<GetAllOrdersServiceResponseDTO[]>(response, 200)

    }

    get name(): string {
        return this.constructor.name
    }

}