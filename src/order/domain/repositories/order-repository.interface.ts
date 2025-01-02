import { Result } from "src/common/domain/result-handler/Result";
import { Order } from "../order";
import { UserId } from "src/user/domain/value-object/user-id";

export interface IOrderRepository {
    saveOrderAggregate(order: Order): Promise<Result<Order>>;
    changeOrderState(order: Order): Promise<Result<Order>>
    findOrderById(id: string): Promise<Result<Order>>;
    findAllOrdersByUser(page: number, limit: number, id_user: UserId): Promise<Result<Order[]>>
    findAllPastOrdersByUser(id_user: UserId): Promise<Result<Order[]>>
    findAllActiveOrdersByUser(id_user: UserId): Promise<Result<Order[]>>
    findAllOrders(page: number, limit: number): Promise<Result<Order[]>>
}