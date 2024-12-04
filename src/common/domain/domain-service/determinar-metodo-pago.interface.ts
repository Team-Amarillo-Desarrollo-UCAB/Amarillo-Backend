import { Order } from "src/order/domain/order";
import { Result } from "../result-handler/Result";

export interface IPaymentMethod{

    execute(orden: Order): Promise<Result<Order>>

}