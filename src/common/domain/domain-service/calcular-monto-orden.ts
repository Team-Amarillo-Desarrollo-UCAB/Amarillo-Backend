import { Order } from "src/order/domain/order";
import { Result } from "../result-handler/Result";
import { IPaymentMethod } from "./determinar-metodo-pago.interface";
import { InvalidPaymentMethod } from "src/payment-method/domain/domain-exception/invalid-payment-method";

export class OrderCalculationTotal {

    private readonly metodoPagoService: IPaymentMethod
    constructor(metodoPagoService: IPaymentMethod) {
        this.metodoPagoService = metodoPagoService
    }

    // TODO: Mas adelante se agregara la aplicacion de los cupones o los descuentos
    async execute(orden: Order): Promise<Result<Order>> {

        let monto_productos = 0
        for (const p of orden.Productos) {
            monto_productos += p.Precio().Amount * p.Cantidad().Value
        }

        orden.assignOrderCost(monto_productos)

        const result = await this.metodoPagoService.execute(orden)

        if (!result.isSuccess())
            return Result.fail<Order>(new InvalidPaymentMethod(result.Message), 404, result.Message)

        orden = result.Value

        return Result.success<Order>(orden, 200)
    }

}