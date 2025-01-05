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
        let moneda: Moneda

        // Entidad parcial de producto con el descuento
        for (const p of orden.Productos) {
            monto_total += parseFloat((p.Precio().Amount * p.Cantidad().Value).toFixed(2))
            //Obtener la moneda dado el currency de la orden
            if (!moneda) moneda = Moneda[p.Moneda().toUpperCase() as keyof typeof Moneda];
            console.log(monto_total)
        }

        // Entidad parcial de combo con el descuento
        for (const c of orden.Bundles) {
            monto_total += parseFloat((c.Precio().Amount * c.Cantidad().Value).toFixed(2))
            //Obtener la moneda dado el currency de la orden
            if (!moneda) moneda = Moneda[c.Moneda().toUpperCase() as keyof typeof Moneda];
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

        console.log(impuesto.Value)

        let shipping_fee = await this.shippingFee.execute(orden.Direccion)
        if (!shipping_fee)
            return Result.fail<Order>(shipping_fee.Error, shipping_fee.StatusCode, shipping_fee.Message)

        let s = subTotal.add(impuesto.Value)
        console.log('sub total: ',s.Value)

        monto_total += shipping_fee.Value.Value
        monto_total += impuesto.Value


        orden.assignOrderCost(OrderTotal.create(
            parseFloat(monto_total.toFixed(2)),
            moneda,
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