import { IApplicationService } from "src/common/application/application-services/application-service.interface";
import { Result } from "src/common/domain/result-handler/Result";
import { IdGenerator } from "src/common/application/id-generator/id-generator.interface";
import { CreateOrderEntryServiceDTO } from "../../DTO/entry/create-order-entry-service";
import { CreateOrderResponseServiceDTO } from "../../DTO/response/create-order-response-service.dto";
import { IOrderRepository } from "src/order/domain/repositories/order-repository.interface";
import { Order } from "src/order/domain/order";
import { OrderId } from "src/order/domain/value-object/order-id";
import { EnumOrderEstados } from "src/order/domain/enum/order-estados-enum";
import { OrderEstado } from "src/order/domain/value-object/order-estado";
import { OrderCreationDate } from "src/order/domain/value-object/order-fecha-creacion";
import { IProductRepository } from "src/product/domain/repositories/product-repository.interface";
import { OrderTotal } from "src/order/domain/value-object/order-total";
import { OrderDetail } from "src/order/domain/entites/order-detail";
import { ProductId } from "src/product/domain/value-objects/product-id";
import { OrderDetalleCantidad } from "src/order/domain/value-object/order-detalle.ts/order-detalle-cantidad";
import { OrderDetalleId } from "src/order/domain/value-object/order-detalle.ts/order-detalle-id";
import { IEventHandler } from "src/common/application/event-handler/event-handler.interface";
import { Product } from "src/product/domain/product";
import { OrderProduct } from "src/order/domain/entites/order-product";
import { OrderProductName } from "src/order/domain/value-object/order-product/order-product-name";
import { OrderProductCantidad } from "src/order/domain/value-object/order-product/order-product-cantidad";
import { OrderProductPrice } from "src/order/domain/value-object/order-product/order-product-price";
import { OrderProductAmount } from "src/order/domain/value-object/order-product/order-product-amount";
import { OrderProductCurrency } from "src/order/domain/value-object/order-product/order-product-currency";
import { IPaymentMethod } from "src/common/domain/domain-service/determinar-metodo-pago.interface";
import { OrderCalculationTotal } from "src/common/domain/domain-service/calcular-monto-orden";
import { OrderBundle } from "src/order/domain/entites/order-bundle";
import { BundleID } from "src/bundle/domain/value-objects/bundle-id";
import { OrderBundleName } from "src/order/domain/value-object/order-bundle/order-bundle-name";
import { OrderBundleCantidad } from "src/order/domain/value-object/order-bundle/order-bundle-cantidad";
import { OrderBundlePrice } from "src/order/domain/value-object/order-bundle/order-bundle-price";
import { OrderBundleAmount } from "src/order/domain/value-object/order-bundle/order-bundle-amount";
import { OrderBundleCurrency } from "src/order/domain/value-object/order-bundle/order-bundle-currency";
import { Detalle_Orden } from "src/order/infraestructure/entites/detalle_orden.entity";
import { IBundleRepository } from "src/bundle/domain/repositories/bundle-repository.interface";

export class CreateOrderService implements IApplicationService<CreateOrderEntryServiceDTO, CreateOrderResponseServiceDTO> {

    constructor(
        private readonly orderRepository: IOrderRepository,
        private readonly productRepository: IProductRepository,
        private readonly bundleRepostiory: IBundleRepository,

        private readonly idGenerator: IdGenerator<string>,
        private readonly eventHandler: IEventHandler,
        private readonly calcularTotalService: OrderCalculationTotal
    ) {
        this.orderRepository = orderRepository
        this.productRepository = productRepository
        this.idGenerator = idGenerator
        this.eventHandler = eventHandler
        this.calcularTotalService = calcularTotalService
    }

    async execute(data: CreateOrderEntryServiceDTO): Promise<Result<CreateOrderResponseServiceDTO>> {

        let productos: OrderProduct[] = []
        let combos: OrderBundle[] = []
        // TODO: Deberia ser un servicio de aplicacion

        // Se crean los productos para la entidad de dominio
        if (data.products) {
            for (const producto of data.products) {
                const product = await this.productRepository.findProductById(producto.id)

                if (!product.isSuccess())
                    return Result.fail<CreateOrderResponseServiceDTO>(new Error("Producto no encontrado"), 404, "Producto no encontrado")

                productos.push(
                    OrderProduct.create(
                        product.Value.Id,
                        OrderProductName.create(product.Value.Name),
                        OrderProductCantidad.create(producto.quantity),
                        OrderProductPrice.create(
                            OrderProductAmount.create(product.Value.Price),
                            OrderProductCurrency.create(product.Value.Moneda)
                        )
                    )
                )

            }
        }

        // Se crean los bundle para la entidad de dominio
        if (data.bundles) {
            for (const c of data.bundles) {
                const combo = await this.bundleRepostiory.findBundleById(c.id)

                if (!combo.isSuccess())
                    return Result.fail<CreateOrderResponseServiceDTO>(new Error("Combo no encontrado"), 404, "Combo no encontrado")
                console.log("Combo encontrado: ",combo)
                combos.push(
                    OrderBundle.create(
                        BundleID.create(combo.Value.Id.Value),
                        OrderBundleName.create(combo.Value.name.Value),
                        OrderBundleCantidad.create(combo.Value.stock.Value),
                        OrderBundlePrice.create(
                            OrderBundleAmount.create(combo.Value.price.Price),
                            OrderBundleCurrency.create(combo.Value.price.Currency)
                        )
                    )
                )

            }
        }

        console.log("Productos de la orden: ", productos)
        console.log("Combos de la orden: ", combos)

        // Se crean los atributos extras de la entidad de dominio
        const id_orden = await this.idGenerator.generateId()
        const estado = EnumOrderEstados.CREATED
        const fecha_creacion = new Date()

        let orden = Order.create(
            OrderId.create(id_orden),
            OrderEstado.create(estado),
            OrderCreationDate.create(fecha_creacion),
            productos,
            combos
        )

        console.log("Orden sin el pago: ",orden)

        // Se utiliza el servicio de dominio para calcular el monto y asignarle el metodo de pago
        const result_domain = await this.calcularTotalService.execute(orden)

        if (!result_domain.isSuccess())
            return Result.fail<CreateOrderResponseServiceDTO>(result_domain.Error, result_domain.StatusCode, result_domain.Message)

        orden = result_domain.Value

        console.log("orden creada: ", orden)

        const result = await this.orderRepository.saveOrderAggregate(orden)

        if (!result.isSuccess())
            return Result.fail(new Error("Orden no creada"), 404, "Orden no creada")

        console.log("Orden alamacenada")

        let detalle_productos = await Promise.all(
            productos.map(async (p) => {
                return {
                    id_detalle: await this.idGenerator.generateId(),
                    id_producto: p.Id.Id,
                    cantidad: p.Cantidad().Value,
                };
            })
        );

        let detalle_combos = await Promise.all(
            combos.map(async (c) => {
                return {
                    id_detalle: await this.idGenerator.generateId(),
                    id_combo: c.Id.Value,
                    cantidad: c.Cantidad().Value,
                };
            })
        );

        const response: CreateOrderResponseServiceDTO = {
            id_orden: result.Value.Id.Id,
            detalle_productos: detalle_productos,
            detalle_combos: detalle_combos,
            fecha_creacion: result.Value.Fecha_creacion.Date_creation,
            estado: result.Value.Estado.Estado
        }

        console.log("Eventos de la orden: ",orden.pullEvents())
        await this.eventHandler.publish(orden.pullEvents())

        return Result.success(response, 200)
    }

    get name(): string {
        return this.constructor.name
    }

}