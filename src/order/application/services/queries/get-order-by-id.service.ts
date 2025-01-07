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

        const find_orden = await this.orderRepository.findOrderById(data.id_orden)

        if (!find_orden.isSuccess())
            return Result.fail(new Error("Orden no encontrada"), 404, "Orden no encontrada")

        const orden = find_orden.Value

        const response: GetOrderByIdResponseServiceDTO = {
            id: orden.Id.Id,
            orderState: orden.Estado.Estado,
            orderCreatedDate: orden.Fecha_creacion.Date_creation,
            totalAmount: orden.Monto.Total,
            sub_total: orden.Monto.SubTotal.Value,
            shipping_fee: orden.Monto.ShippingFee.Value,
            currency: orden.Monto.Currency,
            orderDirection: {
                lat: orden.Direccion.Latitud,
                long: orden.Direccion.Longitud
            },
            directionName: orden.Direccion ? orden.Direccion.Direccion : null,
            products: orden.Productos.map((product) => ({
                id: product.Id.Id,
                quantity: product.Cantidad().Value
            })),
            bundles: orden.Bundles.map((combo) => ({
                id: combo.Id.Value,
                quantity: combo.Cantidad().Value
            })),
            orderReciviedDate: orden.Fecha_entrega ? orden.Fecha_entrega.Date_creation : null,
            orderReport: orden.Reporte ? orden.Reporte.Texto().Texto : null,
            orderPayment: orden.Payment ? {
                amount: orden.Payment.AmountPayment().Total,
                currency: orden.Payment.CurrencyPayment().Currency,
                paymentMethod: orden.Payment.NameMethod().Name()
            } : null,
            orderDiscount: orden.Monto.Discount.Value,
            instructions: orden.Instruction ? orden.Instruction.Value : null
        }

        return Result.success(response, 202)

    }

    get name(): string {
        return this.constructor.name
    }

}