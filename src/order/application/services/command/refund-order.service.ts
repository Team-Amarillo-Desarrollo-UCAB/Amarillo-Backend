import { IApplicationService } from "src/common/application/application-services/application-service.interface";
import { RefundOrderServiceEntryDTO } from "../../DTO/entry/refund-order-service.entry.dto";
import { Result } from "src/common/domain/result-handler/Result";
import { IOrderRepository } from "src/order/domain/repositories/order-repository.interface";
import { IOrderReembolsoPort } from "src/common/domain/domain-service/order-reembolso.port";
import { RefundOrderServiceResponseDTO } from "../../DTO/response/refund-order-service.response.dto";
import { IEventHandler } from "src/common/application/event-handler/event-handler.interface";
import { OrderRefunded } from "src/order/domain/domain-event/order-refunded-event";

export class RefundOrderService implements IApplicationService<RefundOrderServiceEntryDTO, RefundOrderServiceResponseDTO> {

    private readonly orderRepository: IOrderRepository
    private readonly refundService: IOrderReembolsoPort
    private readonly eventHandler: IEventHandler

    constructor(
        orderRepository: IOrderRepository,
        refundService: IOrderReembolsoPort,
        eventHandler: IEventHandler
    ) {
        this.orderRepository = orderRepository
        this.refundService = refundService
        this.eventHandler = eventHandler
    }

    async execute(data: RefundOrderServiceEntryDTO): Promise<Result<RefundOrderServiceResponseDTO>> {
        const find_orden = await this.orderRepository.findOrderById(data.id_orden)
        if (!find_orden.isSuccess())
            return Result.fail(find_orden.Error, find_orden.StatusCode, find_orden.Message)
        const orden = find_orden.Value
        const reembolso = await this.refundService.execute(orden)
        if (!reembolso.isSuccess())
            return Result.fail(reembolso.Error, reembolso.StatusCode, reembolso.Message)

        await this.eventHandler.publish(orden.pullEvents())

        const response: RefundOrderServiceResponseDTO = {
            id_orden: find_orden.Value.Id.Id,
            id_payment: find_orden.Value.Payment.Id.Id,
            monto_reembolsado: find_orden.Value.Payment.AmountPayment().Total
        }

        return Result.success<RefundOrderServiceResponseDTO>(response, 200)

    }
    get name(): string {
        return this.constructor.name
    }

}