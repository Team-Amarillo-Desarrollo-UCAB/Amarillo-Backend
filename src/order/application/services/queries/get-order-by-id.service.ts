import { IApplicationService } from "src/common/application/application-services/application-service.interface";

import { Result } from "src/common/domain/result-handler/Result";
import { IOrderRepository } from "src/order/domain/repositories/order-repository.interface";
import { GetOrderByIdEntryServiceDTO } from "../../DTO/entry/get-order-entry-service.dto";
import { GetOrderByIdResponseServiceDTO } from "../../DTO/response/get-order-response-service.dto";

export class GetOrderByIdService implements IApplicationService
    <GetOrderByIdEntryServiceDTO,
        GetOrderByIdResponseServiceDTO> {

    private readonly orderRepository: IOrderRepository

    constructor(orderRepository: IOrderRepository) {
        this.orderRepository = orderRepository
    }

    async execute(data: GetOrderByIdEntryServiceDTO): Promise<Result<GetOrderByIdResponseServiceDTO>> {

        const orden = await this.orderRepository.findOrderById(data.id_orden)

        if (!orden.isSuccess())
            return Result.fail(new Error("Orden no encontrada"), 404, "Orden no encontrada")

        const response: GetOrderByIdResponseServiceDTO = {
            id_orden: orden.Value.Id.Id,
            detalle: orden.Value.Productos.map((product) => ({
                id_producto: product.Id.Id,
                cantidad_producto: product.Cantidad().Value
            })),
            monto_total: orden.Value.Monto.Total,
            fecha_creacion: orden.Value.Fecha_creacion.Date_creation,
            estado: orden.Value.Estado.Estado
        }

        return Result.success(response, 202)

    }

    get name(): string {
        return this.constructor.name
    }

}