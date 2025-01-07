import { IApplicationService } from "src/common/application/application-services/application-service.interface";
import { CancelOrderServiceEntryDTO } from "../../DTO/entry/cancel-order-service-entry.dto";
import { Result } from "src/common/domain/result-handler/Result";
import { IOrderRepository } from "src/order/domain/repositories/order-repository.interface";
import { IEventHandler } from "src/common/application/event-handler/event-handler.interface";
import { CancelOrderServiceResponseDTO } from "../../DTO/response/cancel-order-service-response.dto";

export class CancelOrderService implements IApplicationService<CancelOrderServiceEntryDTO, CancelOrderServiceResponseDTO> {

    private readonly orderRepository: IOrderRepository
    private readonly eventHandler: IEventHandler

    constructor(
        orderRepository: IOrderRepository,
        eventHandler: IEventHandler
    ) {
        this.orderRepository = orderRepository
        this.eventHandler = eventHandler
    }

    async execute(data: CancelOrderServiceEntryDTO): Promise<Result<any>> {

        const find_order = await this.orderRepository.findOrderById(data.order_id)

        if(!find_order.isSuccess())
            return Result.fail(find_order.Error,find_order.StatusCode,find_order.Message)

        const orden = find_order.Value

        //orden.cancelarOrden()

        const save = await this.orderRepository.changeOrderState(orden)

        if(!save.isSuccess())
            return Result.fail(save.Error,save.StatusCode,save.Message)

        await this.eventHandler.publish(orden.pullEvents())

        return Result.success<CancelOrderServiceResponseDTO>({id_orden: data.order_id},200)
    }

    get name(): string {
        return this.constructor.name
    }

}