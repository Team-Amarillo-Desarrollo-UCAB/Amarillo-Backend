import { Result } from "src/common/domain/result-handler/Result";
import { OrderReport } from "src/order/domain/entites/order-report";
import { EnumOrderEstados } from "src/order/domain/enum/order-estados-enum";
import { Order } from "src/order/domain/order";
import { IOrderRepository } from "src/order/domain/repositories/order-repository.interface";
import { OrderEstado } from "src/order/domain/value-object/order-estado";
import { Detalle_Orden } from "src/order/infraestructure/entites/detalle_orden.entity";
import { Estado } from "src/order/infraestructure/entites/Estado-orden/estado.entity";
import { Estado_Orden } from "src/order/infraestructure/entites/Estado-orden/estado_orden.entity";
import { Payment } from "src/order/infraestructure/entites/payment.entity";
import { UserId } from "src/user/domain/value-object/user-id";
import { EstadoRepositoryMock } from "./estado-repository.mock";
import { OrderObjectMother } from "../objects-mock/order.object-mother";

export class OrderRepositoryMock implements IOrderRepository {

    private readonly orders: Order[] = []
    private readonly payments: Payment[] = []
    private readonly reports: OrderReport[] = []
    private readonly orderStates: Estado_Orden[] = []

    constructor(
        private readonly estadoRepository: EstadoRepositoryMock
    ) { }

    async saveOrderAggregate(order: Order): Promise<Result<Order>> {
        const estado = Estado_Orden.create(
            order.Id.Id,
            null,
            order.Fecha_creacion.Date_creation,
            null
        )
        this.orderStates.push(estado)
        this.orders.push(order);
        return Result.success<Order>(order, 200);
    }

    async updateOrder(order: Order): Promise<Result<Order>> {
        const index = this.orders.findIndex(o => o.Id.Id === order.Id.Id);
        if (index === -1) {
            return Result.fail<Order>(new Error('Order not found'), 404, 'Order not found');
        }
        this.orders[index] = order;
        return Result.success<Order>(order, 200);
    }

    async saveReport(order: Order): Promise<Result<OrderReport>> {

        const orderIndex = this.orders.findIndex(o => o.Id.Id === order.Id.Id);

        if (orderIndex === -1) {
            return Result.fail<OrderReport>(new Error('Order not found'), 404, 'Order not found');
        }

        const orden = OrderObjectMother.createOrderWithReport()

        this.orders[orderIndex] = orden

        return Result.success<OrderReport>(orden.Reporte, 200)
    }

    async changeOrderState(order: Order): Promise<Result<Order>> {
        const estado = new Estado_Orden();
        estado.id_orden = order.Id.Id;
        //estado.fecha_creacion = new Date();
        this.orderStates.push(estado);

        const orderIndex = this.orders.findIndex(o => o.Id.Id === order.Id.Id);
        if (orderIndex === -1) {
            return Result.fail<Order>(new Error('Order not found'), 404, 'Order not found');
        }
        //this.orders[orderIndex].Estado = order.Estado; // Asumiendo que `Estado` es una propiedad
        return Result.success<Order>(order, 200);
    }

    async findOrderById(id: string): Promise<Result<Order>> {
        const order = this.orders.find(o => o.Id.Id === id);
        if (!order) {
            return Result.fail<Order>(new Error(`Order with id ${id} not found`), 404, `Order with id ${id} not found`);
        }
        return Result.success<Order>(order, 200);
    }

    async findAllOrdersByUser(page: number, limit: number, id_user: UserId, status: OrderEstado[]): Promise<Result<Order[]>> {
        const filteredOrders = this.orders.filter(order => order.Comprador.Id === id_user.Id && status.includes(order.Estado));
        const offset = (page - 1) * limit;
        const paginatedOrders = filteredOrders.slice(offset, offset + limit);
        return Result.success<Order[]>(paginatedOrders, 200);
    }

    async findAllPastOrdersByUser(page: number, limit: number, id_user: UserId): Promise<Result<Order[]>> {
        const filteredOrders = this.orders.filter(order => order.Comprador.Id === id_user.Id && [EnumOrderEstados.ENTREGADA, EnumOrderEstados.CANCELED].includes(order.Estado.Estado));
        const offset = (page - 1) * limit;
        const paginatedOrders = filteredOrders.slice(offset, offset + limit);
        return Result.success<Order[]>(paginatedOrders, 200);
    }

    async findAllActiveOrdersByUser(page: number, limit: number, id_user: UserId): Promise<Result<Order[]>> {
        const filteredOrders = this.orders.filter(order => order.Comprador.Id === id_user.Id && ![EnumOrderEstados.ENTREGADA, EnumOrderEstados.CANCELED].includes(order.Estado.Estado));
        const offset = (page - 1) * limit;
        const paginatedOrders = filteredOrders.slice(offset, offset + limit);
        return Result.success<Order[]>(paginatedOrders, 200);
    }

    async findAllOrders(page: number, limit: number, status: OrderEstado[]): Promise<Result<Order[]>> {
        const filteredOrders = this.orders.filter(order => status.includes(order.Estado));
        const offset = (page - 1) * limit;
        const paginatedOrders = filteredOrders.slice(offset, offset + limit);
        return Result.success<Order[]>(paginatedOrders, 200);
    }

    // Métodos adicionales para simular la interacción con los pagos y otros objetos relacionados
    async savePayment(payment: Payment): Promise<Result<Payment>> {
        this.payments.push(payment);
        return Result.success<Payment>(payment, 200);
    }

    async findPaymentByOrderId(order: Order): Promise<Result<Payment>> {
        const payment = this.payments.find(p => p.id === order.Payment.Id.Id);
        if (!payment) {
            return Result.fail<Payment>(new Error('Payment not found'), 404, 'Payment not found');
        }
        return Result.success<Payment>(payment, 200);
    }

    async saveOrderState(orderState: Estado_Orden): Promise<Result<Estado_Orden>> {
        this.orderStates.push(orderState);
        return Result.success<Estado_Orden>(orderState, 200);
    }

    async findOrderStatesByOrderId(orderId: string): Promise<Result<Estado_Orden[]>> {
        const states = this.orderStates.filter(state => state.id_orden === orderId);
        return Result.success<Estado_Orden[]>(states, 200);
    }
}