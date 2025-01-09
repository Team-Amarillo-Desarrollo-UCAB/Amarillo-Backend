import { IApplicationService } from "src/common/application/application-services/application-service.interface";
import { GetAllOrdersServiceEntryDTO } from "../../DTO/entry/get-all-orders-entry-service.dto";
import { GetAllOrdersServiceResponseDTO } from "../../DTO/response/get-all-orders-service-service.dto";
import { Result } from "src/common/domain/result-handler/Result";
import { IOrderRepository } from "src/order/domain/repositories/order-repository.interface";
import { OrderEstado } from "src/order/domain/value-object/order-estado";
import { UserId } from "src/user/domain/value-object/user-id";

export class GetAllOrdersService implements
    IApplicationService<GetAllOrdersServiceEntryDTO, GetAllOrdersServiceResponseDTO[]> {

    constructor(
        private readonly orderRepository: IOrderRepository
    ) { }

    async execute(data: GetAllOrdersServiceEntryDTO): Promise<Result<GetAllOrdersServiceResponseDTO[]>> {

        let page = ((data.page - 1) * data.limit)
        let perPage = data.limit

        const userId = UserId.create(data.userId)

        const estados: OrderEstado[] = data.status.map((estado) => { return OrderEstado.create(estado) })

        const ordenes = await this.orderRepository.findAllOrdersByUser(page, perPage, userId, estados)

        if (!ordenes.isSuccess())
            return Result.fail<GetAllOrdersServiceResponseDTO[]>(ordenes.Error, ordenes.StatusCode, ordenes.Message)

        const response: GetAllOrdersServiceResponseDTO[] = []

        if (ordenes.Value.length > 0) {
            ordenes.Value.map((orden) => response.push({
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
            }))
        }
        return Result.success<GetAllOrdersServiceResponseDTO[]>(response, 200)
    }

    get name(): string {
        return this.constructor.name
    }



}