import { IApplicationService } from "src/common/application/application-services/application-service.interface";
import { Result } from "src/common/domain/result-handler/Result";
import { IdGenerator } from "src/common/application/id-generator/id-generator.interface";
import { CreateOrderEntryServiceDTO } from "../../DTO/entry/create-order-entry-service";
import { CreateOrderResponseServiceDTO } from "../../DTO/response/create-order-response-service.dto";
import { IOrderRepository } from "src/order/domain/repositories/order-repository.interface";
import { Order } from "src/order/domain/order";
import { OrderId } from "src/order/domain/value-object/order-id";
import { EnumOrderEstados } from "src/order/domain/order-estados-enum";
import { OrderEstado } from "src/order/domain/value-object/order-estado";
import { OrderCreationDate } from "src/order/domain/value-object/order-fecha-creacion";
import { IProductRepository } from "src/product/domain/repositories/product-repository.interface";
import { OrderTotal } from "src/order/domain/value-object/order-total";
import { OrderDetail } from "src/order/domain/entites/order-detail";
import { ProductId } from "src/product/domain/value-objects/product-id";
import { OrderDetalleCantidad } from "src/order/domain/value-object/order-detalle.ts/order-detalle-cantidad";
import { OrderDetalleId } from "src/order/domain/value-object/order-detalle.ts/order-detalle-id";
import { IEventHandler } from "src/common/application/event-handler/event-handler.interface";

export class CreateOrderService implements IApplicationService<CreateOrderEntryServiceDTO, CreateOrderResponseServiceDTO> {

    constructor(
        private readonly orderRepository: IOrderRepository,
        private readonly productRepository: IProductRepository,
        private readonly idGenerator: IdGenerator<string>,
        private readonly eventHandler: IEventHandler
    ) {
        this.orderRepository = orderRepository
        this.productRepository = productRepository
        this.idGenerator = idGenerator
        this.eventHandler = eventHandler
    }

    async execute(data: CreateOrderEntryServiceDTO): Promise<Result<CreateOrderResponseServiceDTO>> {

        let monto_total: number = 0;

        for (const detalle of data.entry) {
            const producto = await this.productRepository.findProductById(detalle.id_producto);

            if(!producto.isSuccess())
                throw new Error("Producto del detalle no existente")

            // Sumar el precio del producto multiplicado por la cantidad
            monto_total += producto.Value.Price * detalle.cantidad_producto;
        }

        const id_orden = await this.idGenerator.generateId()
        const estado = EnumOrderEstados.CREATED
        const fecha_creacion = new Date()
        const detalles = await Promise.all(
            data.entry.map(async (detalle) => {
                const id = await this.idGenerator.generateId(); // Esperar a que se resuelva el id
                return OrderDetail.create(
                    OrderDetalleId.create(id), // Asegúrate de crear el objeto de tipo OrderDetalleId
                    ProductId.create(detalle.id_producto),
                    OrderDetalleCantidad.create(detalle.cantidad_producto)
                );
            })
        );

        const orden = Order.create(
            OrderId.create(id_orden),
            OrderEstado.create(estado),
            OrderCreationDate.create(fecha_creacion),
            OrderTotal.create(monto_total),
            detalles
        )

        const result = await this.orderRepository.saveOrderAggregate(orden)

        if(!result.isSuccess())
            return Result.fail(new Error("Orden no creada"), 404, "Orden no creada")

        const response: CreateOrderResponseServiceDTO = {
            id_orden: result.Value.Id.Id,
            detalle_info: detalles.map((detalle) => ({
                id_detalle: detalle.Id.Id,  // Suponiendo que `detalle` tiene una propiedad `id` para el detalle
                id_producto: detalle.ProductoId.Id,  // Suponiendo que `detalle` tiene una propiedad `productId`
                cantidad: detalle.Cantidad.Cantidad // Suponiendo que `detalle` tiene una propiedad `cantidad`
            })),
            fecha_creacion: result.Value.Fecha_creacion,
            estado: result.Value.Estado
        }

        await this.eventHandler.publish( orden.pullEvents() )

        return Result.success(response, 200)
    }

    get name(): string {
        return this.constructor.name
    }

}