import { Order } from "src/order/domain/order";
import { Result } from "../result-handler/Result";
import { IPaymentMethod } from "./determinar-metodo-pago.interface";
import { InvalidPaymentMethod } from "src/payment-method/domain/domain-exception/invalid-payment-method";
import { Cupon } from "src/cupon/domain/cupon";
import { ITaxesCalculationPort } from "./taxes-calculation.port";
import { OrderTotal } from "src/order/domain/value-object/order-total";

export class OrderCalculationTotal {

    private readonly metodoPagoService: IPaymentMethod
    private readonly taxesCalculationService: ITaxesCalculationPort

    constructor(metodoPagoService: IPaymentMethod,taxesService: ITaxesCalculationPort) {
        this.metodoPagoService = metodoPagoService
        this.taxesCalculationService = taxesService
    }

    async execute(orden: Order, cupon?: Cupon): Promise<Result<Order>> {

        let monto_total = 0

        for (const p of orden.Productos) {
            monto_total += p.Precio().Amount * p.Cantidad().Value
        }

        for (const c of orden.Bundles) {
            monto_total += c.Precio().Amount * c.Cantidad().Value
        }

        if (cupon) {

            const fecha_actual = new Date()
            const fecha_vencimiento = cupon.ExpirationDate()

            fecha_actual.setHours(0, 0, 0, 0)
            fecha_vencimiento.setHours(0, 0, 0, 0)

            if(fecha_actual.getTime() < fecha_vencimiento.getTime())
                monto_total -= cupon.Amount()
        }

        const total = OrderTotal.create(monto_total)

        let impuestos = await this.taxesCalculationService.execute(total)

        orden.assignOrderCost(OrderTotal.create(monto_total + impuestos.Value))

        const result = await this.metodoPagoService.execute(orden)

        if (!result.isSuccess())
            return Result.fail<Order>(new InvalidPaymentMethod(result.Message), 404, result.Message)

        return Result.success<Order>(orden, 200)
    }

}