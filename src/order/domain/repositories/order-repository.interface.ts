import { Result } from "src/common/domain/result-handler/Result";
import { Order } from "../order";
import { UserId } from "src/user/domain/value-object/user-id";
import { OrderReport } from "../entites/order-report";
import { OrderEstado } from "../value-object/order-estado";

export interface IOrderRepository {
    saveOrderAggregate(order: Order): Promise<Result<Order>>;
    changeOrderState(order: Order): Promise<Result<Order>>
    saveReport(order: Order, reporte: OrderReport): Promise<Result<OrderReport>>
    findOrderById(id: string): Promise<Result<Order>>;
    findAllOrdersByUser(page: number, limit: number, id_user: UserId, status: OrderEstado[]): Promise<Result<Order[]>>
    findAllPastOrdersByUser(page: number, limit: number, id_user: UserId): Promise<Result<Order[]>>
    findAllActiveOrdersByUser(page: number, limit: number, id_user: UserId): Promise<Result<Order[]>>
    findAllOrders(page: number, limit: number, status: OrderEstado[]): Promise<Result<Order[]>>
}