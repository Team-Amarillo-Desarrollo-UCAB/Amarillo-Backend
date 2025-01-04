import { Order } from "src/order/domain/order";
import { Result } from "../result-handler/Result";
import { IPaymentMethod } from "./determinar-metodo-pago.interface";
import { InvalidPaymentMethod } from "src/payment-method/domain/domain-exception/invalid-payment-method";
import { Cupon } from "src/cupon/domain/cupon";
import { ITaxesCalculationPort } from "./taxes-calculation.port";
import { OrderTotal } from "src/order/domain/value-object/order-total";
import { Moneda } from "src/product/domain/enum/Monedas";
import { OrderDiscount } from "src/order/domain/value-object/order-discount";
import { OrderSubTotal } from "src/order/domain/value-object/order-subtotal";
import { IShippingFee } from "./shipping-fee-calculate.port";

export class OrderCalculationTotal {

    private readonly metodoPagoService: IPaymentMethod
    private readonly taxesCalculationService: ITaxesCalculationPort
    private readonly shippingFee: IShippingFee

    constructor(
        metodoPagoService: IPaymentMethod,
        taxesService: ITaxesCalculationPort,
        shippingFee: IShippingFee
    ) {
        this.metodoPagoService = metodoPagoService
        this.taxesCalculationService = taxesService
        this.shippingFee = shippingFee
    }

    async execute(orden: Order, subTotal: OrderSubTotal, cupon?: Cupon): Promise<Result<Order>> {

        let monto_total = 0
        let descuento_cupon = 0

        // Entidad parcial de producto con el descuento
        for (const p of orden.Productos) {
            monto_total += p.Precio().Amount * p.Cantidad().Value
        }

        // Entidad parcial de combo con el descuento
        for (const c of orden.Bundles) {
            monto_total += c.Precio().Amount * c.Cantidad().Value
        }

        if (cupon) {

            const fecha_actual = new Date()
            const fecha_vencimiento = cupon.ExpirationDate()

            fecha_actual.setHours(0, 0, 0, 0)
            fecha_vencimiento.setHours(0, 0, 0, 0)

            if (fecha_actual.getTime() < fecha_vencimiento.getTime()) {
                monto_total -= cupon.Amount()
                descuento_cupon += cupon.Amount()
            }
        }

        const impuesto = await this.taxesCalculationService.execute(subTotal)
        if (!impuesto.isSuccess())
            return Result.fail<Order>(impuesto.Error, impuesto.StatusCode, impuesto.Message)

        let shipping_fee = await this.shippingFee.execute(orden.Direccion)
        if(!shipping_fee)
            return Result.fail<Order>(shipping_fee.Error,shipping_fee.StatusCode,shipping_fee.Message)

        monto_total -= shipping_fee.Value.Value
        monto_total -= impuesto.Value

        orden.assignOrderCost(OrderTotal.create(
            monto_total,
            Moneda.USD,
            OrderDiscount.create(descuento_cupon),
            subTotal,
            shipping_fee.Value
        ))

        const result = await this.metodoPagoService.execute(orden)

        if (!result.isSuccess())
            return Result.fail<Order>(new InvalidPaymentMethod(result.Message), 404, result.Message)

        return Result.success<Order>(orden, 200)
    }

}