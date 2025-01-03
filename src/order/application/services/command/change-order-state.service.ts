import { IApplicationService } from "src/common/application/application-services/application-service.interface";
import { ChangeOrderServiceEntryDTO } from "../../DTO/entry/change-order-service-entry.dto";
import { Result } from "src/common/domain/result-handler/Result";
import { IOrderRepository } from "src/order/domain/repositories/order-repository.interface";
import { ChangeOrderServiceResponseDTO } from "../../DTO/response/change-order-service-response.dto";
import { IEventHandler } from "src/common/application/event-handler/event-handler.interface";

export class ChangeOrderStateService implements IApplicationService<ChangeOrderServiceEntryDTO, ChangeOrderServiceResponseDTO> {

    constructor(
        private readonly orderRepository: IOrderRepository,
        private readonly eventHandler: IEventHandler
    ) { }

    async execute(data: ChangeOrderServiceEntryDTO): Promise<Result<ChangeOrderServiceResponseDTO>> {

        try {
            const find_orden = await this.orderRepository.findOrderById(data.id_order)
            if (!find_orden.isSuccess())
                return Result.fail(find_orden.Error, find_orden.StatusCode, find_orden.Message)

            const orden = find_orden.Value

            orden.cambiarEstado(data.orderState)

            const save = await this.orderRepository.changeOrderState(orden)
            if (!save.isSuccess())
                return Result.fail(save.Error, save.StatusCode, save.Message)

            const result: ChangeOrderServiceResponseDTO = {
                id_order: orden.Id.Id,
            }

            return Result.success<ChangeOrderServiceResponseDTO>(result, 200)
        } catch (error) {
            return Result.fail(error, 500, error.message)
        }

    }

    get name(): string {
        return this.constructor.name
    }

}