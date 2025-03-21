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

        let page = ((data.page - 1) * data.perPage)
        let perPage = data.perPage

        const find_orders = await this.orderRepository.findAllActiveOrdersByUser(page,perPage,UserId.create(data.userId))

        if (!find_orders.isSuccess())
            return Result.fail(find_orders.Error, find_orders.StatusCode, find_orders.Message)


        const response: GetAllOrdersServiceResponseDTO[] = []

        for (const orden of find_orders.Value) {

            response.push({
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
                directionName: orden.Direccion.Direccion,
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
            })

        }

        return Result.success<GetAllOrdersServiceResponseDTO[]>(response, 200)

    }

    get name(): string {
        return this.constructor.name
    }

}