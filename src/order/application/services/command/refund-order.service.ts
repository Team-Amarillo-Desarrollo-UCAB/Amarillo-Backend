import { IApplicationService } from "src/common/application/application-services/application-service.interface";
import { RefundOrderServiceEntryDTO } from "../../DTO/entry/refund-order-service.entry.dto";
import { Result } from "src/common/domain/result-handler/Result";
import { IOrderRepository } from "src/order/domain/repositories/order-repository.interface";
import { IOrderReembolsoPort } from "src/common/domain/domain-service/order-reembolso.port";
import { RefundOrderServiceResponseDTO } from "../../DTO/response/refund-order-service.response.dto";

export class RefundOrderService implements IApplicationService<RefundOrderServiceEntryDTO, RefundOrderServiceResponseDTO> {

    private readonly orderRepository: IOrderRepository
    private readonly refundService: IOrderReembolsoPort

    constructor(
        orderRepository: IOrderRepository,
        refundService: IOrderReembolsoPort
    ) {
        this.orderRepository = orderRepository
        this.refundService = refundService
    }

    async execute(data: RefundOrderServiceEntryDTO): Promise<Result<RefundOrderServiceResponseDTO>> {
        const find_orden = await this.orderRepository.findOrderById(data.id_orden)
        if (!find_orden.isSuccess())
            return Result.fail(find_orden.Error, find_orden.StatusCode, find_orden.Message)

        const reembolso = await this.refundService.execute(find_orden.Value)
        if (!reembolso.isSuccess())
            return Result.fail(reembolso.Error, reembolso.StatusCode, reembolso.Message)

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