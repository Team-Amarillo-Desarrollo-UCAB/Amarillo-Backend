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
import { IEventHandler } from "src/common/application/event-handler/event-handler.interface";
import { OrderProduct } from "src/order/domain/entites/order-product";
import { OrderProductName } from "src/order/domain/value-object/order-product/order-product-name";
import { OrderProductCantidad } from "src/order/domain/value-object/order-product/order-product-cantidad";
import { OrderProductPrice } from "src/order/domain/value-object/order-product/order-product-price";
import { OrderProductAmount } from "src/order/domain/value-object/order-product/order-product-amount";
import { OrderProductCurrency } from "src/order/domain/value-object/order-product/order-product-currency";
import { OrderCalculationTotal } from "src/common/domain/domain-service/calcular-monto-orden";
import { OrderBundle } from "src/order/domain/entites/order-bundle";
import { BundleID } from "src/bundle/domain/value-objects/bundle-id";
import { OrderBundleName } from "src/order/domain/value-object/order-bundle/order-bundle-name";
import { OrderBundleCantidad } from "src/order/domain/value-object/order-bundle/order-bundle-cantidad";
import { OrderBundlePrice } from "src/order/domain/value-object/order-bundle/order-bundle-price";
import { OrderBundleAmount } from "src/order/domain/value-object/order-bundle/order-bundle-amount";
import { OrderBundleCurrency } from "src/order/domain/value-object/order-bundle/order-bundle-currency";
import { IBundleRepository } from "src/bundle/domain/repositories/bundle-repository.interface";
import { InvalidProductStock } from "src/product/domain/domain-exception/invalid-product-stock";
import { UserId } from "src/user/domain/value-object/user-id";
import { ICuponRepository } from "src/cupon/domain/repositories/cupon-repository.interface";
import { Cupon } from "src/cupon/domain/cupon";
import { IDiscountRepository } from "src/discount/domain/repositories/discount.repository.interface";
import { OrderReciviedDate } from "src/order/domain/value-object/order-recivied-date";
import { OrderLocationDelivery } from "src/order/domain/value-object/order-location-delivery";
import { OrderDiscount } from "src/order/domain/value-object/order-discount";
import { OrderSubTotal } from "src/order/domain/value-object/order-subtotal";
import { OrderInstructions } from "src/order/domain/value-object/order-instructions";

export class CreateOrderService implements IApplicationService<CreateOrderEntryServiceDTO, CreateOrderResponseServiceDTO> {

    //TODO: Verificar todas estas responsabilidades

    constructor(
        private readonly orderRepository: IOrderRepository,
        private readonly productRepository: IProductRepository,
        private readonly bundleRepostiory: IBundleRepository,
        private readonly cuponRepository: ICuponRepository,
        private readonly discountRepository: IDiscountRepository,

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
        let subTotal: number = 0

        let detalle_productos: any[] = []
        let detalle_combos: any[] = []

        // Se crean los productos para la entidad de dominio
        if (data.products) {
            for (const p of data.products) {
                const find_product = await this.productRepository.findProductById(p.id)

                if (!find_product.isSuccess())
                    return Result.fail<CreateOrderResponseServiceDTO>(new Error("Producto no encontrado"), 404, "Producto no encontrado")

                const producto = find_product.Value

                if (producto.Stock < p.quantity)
                    return Result.fail<CreateOrderResponseServiceDTO>(new InvalidProductStock("Cantidad excede el stock actual del producto"), 409, "Cantidad excede el stock actual del producto")

                let precio_producto = producto.Price
                subTotal += precio_producto * p.quantity

                if (producto.Discount && producto.Discount.Value != null) {

                    const find_discount = await this.discountRepository.findDiscountById(producto.Discount.Value)

                    if (!find_discount.isSuccess())
                        return Result.fail<CreateOrderResponseServiceDTO>(find_discount.Error, find_discount.StatusCode, find_discount.Message)


                    //descuento += precio_producto * (find_discount.Value.Percentage.Value / 100)

                    precio_producto -= parseFloat((precio_producto * (find_discount.Value.Percentage.Value / 100)).toFixed(2))

                }

                productos.push(
                    OrderProduct.create(
                        producto.Id,
                        OrderProductName.create(producto.Name),
                        OrderProductCantidad.create(p.quantity),
                        OrderProductPrice.create(
                            OrderProductAmount.create(precio_producto),
                            OrderProductCurrency.create(producto.Moneda)
                        )
                    )
                )

                detalle_productos.push({
                    id: producto.Id.Id,
                    quantity: p.quantity,
                    nombre: producto.Name,
                    descripcion: producto.Description,
                    price: producto.Price,
                    currency: producto.Moneda,
                    images: producto.Images.map((imagen) => {
                        return imagen.Image
                    })
                })

            }
        }

        // Se crean los bundle para la entidad de dominio
        if (data.bundles) {
            for (const c of data.bundles) {
                const find_combo = await this.bundleRepostiory.findBundleById(c.id)

                if (!find_combo.isSuccess())
                    return Result.fail<CreateOrderResponseServiceDTO>(new Error("Combo no encontrado"), 404, "Combo no encontrado")

                const combo = find_combo.Value

                if (combo.stock.Value < c.quantity)
                    return Result.fail<CreateOrderResponseServiceDTO>(new Error("Cantidad excede el stock actual del combo"), 409, "Cantidad excede el stock actual del combo")

                let precio_combo = combo.price.Price
                subTotal += precio_combo * c.quantity

                if (combo.Discount && combo.Discount.Value != null) {
                    const find_discount = await this.discountRepository.findDiscountById(combo.Discount.Value)

                    if (!find_discount.isSuccess())
                        return Result.fail<CreateOrderResponseServiceDTO>(find_discount.Error, find_discount.StatusCode, find_discount.Message)

                    //descuento += precio_combo * (find_discount.Value.Percentage.Value / 100)
                    precio_combo -= parseFloat((precio_combo * (find_discount.Value.Percentage.Value / 100)).toFixed(2))
                }

                combos.push(
                    OrderBundle.create(
                        BundleID.create(combo.Id.Value),
                        OrderBundleName.create(combo.name.Value),
                        OrderBundleCantidad.create(c.quantity),
                        OrderBundlePrice.create(
                            OrderBundleAmount.create(precio_combo),
                            OrderBundleCurrency.create(combo.price.Currency)
                        )
                    )
                )

                detalle_combos.push({
                    id: combo.Id,
                    quantity: c.quantity,
                    nombre: combo.name,
                    descripcion: combo.description,
                    price: combo.price.Price,
                    currency: combo.price.Currency,
                    images: combo.images.map((imagen) => {
                        return imagen.Value
                    })
                })

            }
        }

        // Se crean los atributos extras de la entidad de dominio
        const id_orden = await this.idGenerator.generateId()

        let orden = Order.create(
            OrderId.create(id_orden),
            OrderEstado.create(EnumOrderEstados.CREADA),
            OrderCreationDate.create(new Date()),
            OrderReciviedDate.create(new Date(data.orderReciviedDate)),
            OrderLocationDelivery.create(
                data.ubicacion,
                data.longitud,
                data.latitud
            ),
            productos,
            combos,
            UserId.create(data.userId),
            data.instructions ? OrderInstructions.create(data.instructions) : null
        )

        let cupon: Cupon

        if (data.cupon_code) {
            const find_cupon = await this.cuponRepository.findCuponByCode(data.cupon_code)

            if (!find_cupon.isSuccess())
                return Result.fail<CreateOrderResponseServiceDTO>(find_cupon.Error, find_cupon.StatusCode, find_cupon.Message)

            cupon = find_cupon.Value
        }

        // Se utiliza el servicio de dominio para calcular el monto y asignarle el metodo de pago
        const result_domain = await this.calcularTotalService.execute(orden, OrderSubTotal.create(subTotal), cupon)

        if (!result_domain.isSuccess())
            return Result.fail<CreateOrderResponseServiceDTO>(result_domain.Error, result_domain.StatusCode, result_domain.Message)

        orden = result_domain.Value

        const result = await this.orderRepository.saveOrderAggregate(orden)

        if (!result.isSuccess())
            return Result.fail(new Error("Orden no creada"), 404, "Orden no creada")

        const response: CreateOrderResponseServiceDTO = {
            id: result.Value.Id.Id,
            orderState: result.Value.Estado.Estado,
            orderCreatedDate: result.Value.Fecha_creacion.Date_creation,
            totalAmount: result.Value.Monto.Total,
            currency: result.Value.Moneda,
            orderDirection: {
                lat: result.Value.Direccion.Latitud,
                long: result.Value.Direccion.Longitud
            },
            products: detalle_productos,
            bundles: detalle_combos,
            orderReciviedDate: result.Value.Fecha_entrega ? result.Value.Fecha_entrega.Date_creation : null,
            orderReport: null,
            orderPayment: {
                amount: result.Value.Payment.AmountPayment().Total,
                currency: result.Value.Payment.CurrencyPayment().Currency,
                paymentMethod: result.Value.Payment.NameMethod().Name()
            }
        }

        await this.eventHandler.publish(orden.pullEvents())

        return Result.success(response, 200)
    }

    get name(): string {
        return this.constructor.name
    }

}