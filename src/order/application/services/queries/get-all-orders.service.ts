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

        const estados: OrderEstado[] = data.status.map((estado) => {return OrderEstado.create(estado)})

        const ordenes = await this.orderRepository.findAllOrdersByUser(page, perPage,userId,estados)

        if (!ordenes.isSuccess())
            return Result.fail<GetAllOrdersServiceResponseDTO[]>(ordenes.Error, ordenes.StatusCode, ordenes.Message)

        const response: GetAllOrdersServiceResponseDTO[] = []

        if (ordenes.Value.length > 0) {
            ordenes.Value.map((orden) => response.push({
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
                directionName: orden.Direccion.Direccion,
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
            }))
        }
        return Result.success<GetAllOrdersServiceResponseDTO[]>(response, 200)
    }

    get name(): string {
        return this.constructor.name
    }



}