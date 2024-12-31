import { OrderTotal } from "src/order/domain/value-object/order-total";
import { Result } from "../result-handler/Result";

export interface ITaxesCalculationPort{
     execute(t: OrderTotal):Promise<Result<number>>
}