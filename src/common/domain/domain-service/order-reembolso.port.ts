import { Order } from "src/order/domain/order";
import { Result } from "../result-handler/Result";

export interface IOrderReembolsoPort{
    execute (o:Order) : Promise<Result<string>>
}