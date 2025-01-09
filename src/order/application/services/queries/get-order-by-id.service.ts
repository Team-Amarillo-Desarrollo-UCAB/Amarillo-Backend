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
            totalAmount: parseFloat(orden.Monto.Total.toString()),
            sub_total: parseFloat(orden.Monto.SubTotal.Value.toString()),
            shipping_fee: parseFloat(orden.Monto.ShippingFee.Value.toString()),
            currency: orden.Monto.Currency,
            orderDirection: {
                lat: parseFloat(orden.Direccion.Latitud.toString()),
                long: parseFloat(orden.Direccion.Longitud.toString())
            },
            directionName: orden.Direccion ? orden.Direccion.Direccion : null,
            products: orden.Productos.map((product) => ({
                id: product.Id.Id,
                quantity: parseFloat(product.Cantidad().Value.toString())
            })),
            bundles: orden.Bundles.map((combo) => ({
                id: combo.Id.Value,
                quantity: parseFloat(combo.Cantidad().Value.toString())
            })),
            orderReciviedDate: orden.Fecha_entrega ? orden.Fecha_entrega.ReciviedDate : null,
            orderReport: orden.Reporte ? orden.Reporte.Texto().Texto : null,
            orderPayment: orden.Payment ? {
                amount: parseFloat(orden.Payment.AmountPayment().Total.toString()),
                currency: orden.Payment.CurrencyPayment().Currency,
                paymentMethod: orden.Payment.NameMethod().Name()
            } : null,
            orderDiscount: parseFloat(orden.Monto.Discount.Value.toString()),
            instructions: orden.Instruction ? orden.Instruction.Value : null
        }

        return Result.success(response, 202)

    }

    get name(): string {
        return this.constructor.name
    }

}