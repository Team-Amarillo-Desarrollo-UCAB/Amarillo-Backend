import { Order } from "src/order/domain/order";
import { Result } from "../result-handler/Result";

export interface IOrderReembolsoPort{
    execute (orden:Order) : Promise<Result<string>>
}