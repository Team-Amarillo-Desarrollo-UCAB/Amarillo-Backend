import { Result } from "src/common/domain/result-handler/Result";
import { Order } from "../order";

export interface IOrderRepository {
    saveOrderAggregate(order: Order): Promise<Result<Order>>;
    findOrderById(id: string): Promise<Result<Order>>;
    findAllOrdersByUser(page: number, limit: number, id_user: string): Promise<Result<Order[]>>
    findAllOrders(page: number, limit: number): Promise<Result<Order[]>>
}