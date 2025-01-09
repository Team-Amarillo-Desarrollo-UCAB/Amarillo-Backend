import { IApplicationService } from "src/common/application/application-services/application-service.interface";
import { UpdateOrderInformationServiceEntryDTO } from "../../DTO/entry/update-order-information-service-entry.dto";
import { Result } from "src/common/domain/result-handler/Result";
import { IOrderRepository } from "src/order/domain/repositories/order-repository.interface";
import { IEventHandler } from "src/common/application/event-handler/event-handler.interface";
import { OrderLocationDelivery } from "src/order/domain/value-object/order-location-delivery";
import { OrderReciviedDate } from "src/order/domain/value-object/order-recivied-date";
import { UpdateOrderServiceResponseDTO } from "../../DTO/response/update-order-service-response.dto";

export class UpdateOrderInformationService implements
    IApplicationService<UpdateOrderInformationServiceEntryDTO, UpdateOrderServiceResponseDTO> {

    constructor(
        private readonly ordenRepository: IOrderRepository,
        private readonly eventHandler: IEventHandler
    ) {

    }

    async execute(data: UpdateOrderInformationServiceEntryDTO): Promise<Result<UpdateOrderServiceResponseDTO>> {

        const find_order = await this.ordenRepository.findOrderById(data.id_orden)
        if (!find_order.isSuccess())
            return Result.fail(find_order.Error, 404, find_order.Message)

        const orden = find_order.Value

        if (data.direccion && data.latitud && data.longitud)
            orden.modifiedLocationDelivery(OrderLocationDelivery.create(
                data.direccion,
                data.longitud,
                data.latitud
            ))

        if (data.orderReciviedDate) {
            orden.modifiedReciviedDate(OrderReciviedDate.create(
                new Date(data.orderReciviedDate)
            ))
        }

        const update = await this.ordenRepository.updateOrder(orden)
        if (!update.isSuccess())
            return Result.fail(update.Error, update.StatusCode, update.Message)

        const response: UpdateOrderServiceResponseDTO = {
            id_orden: data.id_orden
        }

        return Result.success(response, 200)
    }
    get name(): string {
        return this.constructor.name
    }

}