import { OrderTotal } from "src/order/domain/value-object/order-total";
import { Result } from "../result-handler/Result";
import { OrderSubTotal } from "src/order/domain/value-object/order-subtotal";

export interface ITaxesCalculationPort{
     execute(t: OrderSubTotal):Promise<Result<number>>
}