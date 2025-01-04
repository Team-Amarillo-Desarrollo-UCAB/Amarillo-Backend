/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Inject,
    Logger,
    Param,
    ParseUUIDPipe,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Post,
    Query,
    UseGuards
} from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { DataSource } from "typeorm";

import { LoggingDecorator } from "src/common/application/application-services/decorators/logging-decorator/logging.decorator";
import { NativeLogger } from "src/common/infraestructure/logger/logger";
import { IdGenerator } from "src/common/application/id-generator/id-generator.interface";
import { UuidGenerator } from "src/common/infraestructure/id-generator/uuid-generator";
import { RabbitEventBus } from "src/common/infraestructure/rabbit-event-handler/rabbit-event-handler";
import { IOrderRepository } from "src/order/domain/repositories/order-repository.interface";
import { OrderRepository } from "../repositories/order-repository";
import { CreateOrderResponseDTO } from "../DTO/response/create-order-response";
import { CreateOrderEntryServiceDTO } from "src/order/application/DTO/entry/create-order-entry-service";
import { CreateOrderService } from "src/order/application/services/command/create-order.service";
import { IProductRepository } from "src/product/domain/repositories/product-repository.interface";
import { OrmProductRepository } from "src/product/infraestructure/repositories/product-repository";
import { ProductMapper } from "src/product/infraestructure/mappers/product-mapper";
import { OrderMapper } from "../mappers/order-mapper";
import { CreateDetalleService } from "../services/command/create-detalle-orden.service";
import { DetalleRepository } from "../repositories/detalle_orden.respoitory";
import { NodemailerEmailSender } from "src/common/infraestructure/utils/nodemailer-email-sender.infraestructure";
import { OrderCreated } from "src/order/domain/domain-event/order-created-event";
import { CreateOrderRequestDTO } from "../DTO/entry/create-order-request-dto";
import { GetOrderByIdReponseDTO } from "../DTO/response/get-order-by-id-response";
import { GetOrderByIdEntryServiceDTO } from "src/order/application/DTO/entry/get-order-entry-service.dto";
import { GetOrderByIdService } from "src/order/application/services/queries/get-order-by-id.service";
import { JwtAuthGuard } from "src/auth/infraestructure/jwt/decorator/jwt-auth.guard";
import { GetUser } from "src/auth/infraestructure/jwt/decorator/get-user.param.decorator";
import { OrderCalculationTotal } from "src/common/domain/domain-service/calcular-monto-orden";
import { PaypalPaymentMethod } from "src/common/infraestructure/payment/paypal-payment-method";
import { CreateOrderPayPalEntryDTO } from "../DTO/entry/create-order-paypal-entry.dto";
import { ExceptionDecorator } from "src/common/application/application-services/decorators/exception-decorator/exception.decorator";
import { PerformanceDecorator } from "src/common/application/application-services/decorators/performance-decorator/performance-decorator";
import { HttpExceptionHandler } from "src/common/infraestructure/exception-handler/http-exception-handler-code";
import { ProductStock } from "src/product/domain/value-objects/product-stock";
import { StripePaymentMethod } from "src/common/infraestructure/payment/stripe-payment-method";
import { CreateOrderStripeEntryDTO } from '../DTO/entry/create-order-stripe-entry.dto';
import { OrmCategoryMapper } from "src/category/infraestructure/mappers/orm-category-mapper";
import { OrmCategoryRepository } from "src/category/infraestructure/repositories/orm-category-repository";
import { PaymentMethodRepository } from "src/payment-method/infraestructure/repositories/payment-method-repository";
import { PaymentMethodMapper } from "src/payment-method/infraestructure/mappers/payment-method-mapper";
import { PaginationDto } from "src/common/infraestructure/dto/entry/pagination.dto";
import { GetAllOrdersServiceEntryDTO } from "src/order/application/DTO/entry/get-all-orders-entry-service.dto";
import { GetAllOrdersService } from '../../application/services/queries/get-all-orders.service';
import { GetAllOrdersReponseDTO } from "../DTO/response/get-all-ordes-response";
import { PaymentMapper } from "../mappers/payment-mapper";
import { OrmBundleRepository } from "src/bundle/infraestructure/repositories/orm-bundle.repository";
import { BundleMapper } from "src/bundle/infraestructure/mappers/bundle-mapper";
import { BundleStock } from "src/bundle/domain/value-objects/bundle-stock";
import { ICuponRepository } from "src/cupon/domain/repositories/cupon-repository.interface";
import { CuponRepository } from "src/cupon/infraestructure/repositories/cupon-repository";
import { CuponMapper } from "src/cupon/infraestructure/mappers/cupon-mapper";
import { GetPastOrdersServiceEntryDTO } from "src/order/application/DTO/entry/get-past-orders-service-entry.dto";
import { GetPastOrdersService } from "src/order/application/services/queries/get-past-orders.service";
import { GetActiveOrdersService } from "src/order/application/services/queries/get-active-orders.service";
import { GetActiveOrdersServiceEntryDTO } from "src/order/application/DTO/entry/get-active-orders-service-entry.dto";
import { IDiscountRepository } from "src/discount/domain/repositories/discount.repository.interface";
import { OrmDiscountMapper } from "src/discount/infraestructure/mappers/discount.mapper";
import { OrmDiscountRepository } from "src/discount/infraestructure/repositories/orm-discount.repository";
import { ITaxesCalculationPort } from "src/common/domain/domain-service/taxes-calculation.port";
import { TaxesCalculationAdapter } from "src/common/infraestructure/domain-services-adapters/taxes-calculation-order.adapter";
import { ChangeOrderStateResponseDTO } from "../DTO/response/change-order-state-response.dto";
import { ChangeOrderStateEntryDTO } from "../DTO/entry/change-order-state-entry.dto";
import { ChangeOrderServiceEntryDTO } from "src/order/application/DTO/entry/change-order-service-entry.dto";
import { ChangeOrderStateService } from "src/order/application/services/command/change-order-state.service";
import { ChangeOrderServiceResponseDTO } from "src/order/application/DTO/response/change-order-service-response.dto";
import { ReportMapper } from "../mappers/report-mapper";
import { CreateReportEntryDTO } from "../DTO/entry/create-report-entry.dto";
import { CreateReportResponseDTO } from "../DTO/response/create-report-response.dto";
import { CreateReportServiceEntryDTO } from "src/order/application/DTO/entry/create-report-service-entry.dto";
import { CreateReportService } from "src/order/application/services/command/create-report.service";
import { IShippingFee } from "src/common/domain/domain-service/shipping-fee-calculate.port";
import { ShippingFeeDistance } from "src/common/infraestructure/domain-services-adapters/shipping-fee-distance.adapter";
import { OrderLocationDelivery } from '../../domain/value-object/order-location-delivery';
import Stripe from "stripe";

@ApiTags("Order")
@Controller("order")
export class OrderController {

    private readonly idGenerator: IdGenerator<string>
    private readonly eventBus = RabbitEventBus.getInstance();
    private readonly logger: Logger = new Logger('OrderController')
    private readonly taxes: ITaxesCalculationPort

    private readonly orderRepository: IOrderRepository
    private readonly productRepository: IProductRepository
    private readonly cuponReporitory: ICuponRepository
    private readonly detalleRepository: DetalleRepository
    private readonly categoryRepository: OrmCategoryRepository
    private readonly paymentMethodRepository: PaymentMethodRepository
    private readonly bundleRepository: OrmBundleRepository;
    private readonly discountRepository: IDiscountRepository


    constructor(
        @Inject('DataSource') private readonly dataSource: DataSource
    ) {
        this.idGenerator = new UuidGenerator();
        this.taxes = new TaxesCalculationAdapter()

        this.orderRepository =
            new OrderRepository(
                new OrderMapper(this.idGenerator, new PaymentMapper()),
                new PaymentMapper(),
                new ReportMapper(),
                dataSource
            )
        this.bundleRepository = new OrmBundleRepository(
            new BundleMapper(),
            this.dataSource
        );
        this.cuponReporitory = new CuponRepository(
            new CuponMapper(),
            this.dataSource
        )
        this.categoryRepository = new OrmCategoryRepository(new OrmCategoryMapper(), dataSource)
        this.productRepository =
            new OrmProductRepository(
                new ProductMapper(
                    new OrmCategoryMapper(),
                    this.categoryRepository,
                ), dataSource
            )
        this.detalleRepository = new DetalleRepository(dataSource)
        this.paymentMethodRepository = new PaymentMethodRepository(dataSource, new PaymentMethodMapper())
        this.discountRepository = new OrmDiscountRepository(new OrmDiscountMapper(), dataSource)
    }

    @Get('one/by/:id')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({
        description: 'Devuelve la informacion de una orden dado el id',
        type: GetOrderByIdReponseDTO
    })
    async getOrder(
        @Param('id', ParseUUIDPipe) id: string,
    ) {

        const data: GetOrderByIdEntryServiceDTO = {
            userId: "24117a35-07b0-4890-a70f-a082c948b3d4",
            id_orden: id
        }

        const service =
            new LoggingDecorator(
                new GetOrderByIdService(
                    this.orderRepository
                ),
                new NativeLogger(this.logger)
            )

        const result = await service.execute(data)

        // TODO: Esto sera reemplazado por el aspecto de HTTPExceptionHandler
        if (!result.isSuccess())
            throw result.Error

        console.log("Resultado del servicio: ", result.Value)

        const response: GetOrderByIdReponseDTO = {
            id: id,
            ...result.Value
        };

        return response

    }

    @Post('pay/paypal')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({
        description: 'Crea la orden con el metodo de pago de PayPal',
        type: CreateOrderResponseDTO
    })
    async orderPayPaypal(
        @GetUser() user,
        @Body() request: CreateOrderPayPalEntryDTO,
    ) {

        // Envia correo electronico para informar de la creacion de la orden
        await this.eventBus.subscribe('OrderCreated', async (event: OrderCreated) => {
            const sender = new NodemailerEmailSender();
            const order_id = event.id;
            console.log("Receptor: ", user.email)
            sender.sendEmail(user.email, user.name, order_id);
        }, 'Notificar orden de compra');

        // Decrementa el stock de los productos elegidos en la orden
        await this.eventBus.subscribe('OrderCreated', async (event: OrderCreated) => {
            console.log("Se publico el evento para decrementar los productos")

            const productos = event.productos

            for (const p of productos) {
                const result = await this.productRepository.findProductById(p.Id.Id)
                result.Value.decreaseStock(ProductStock.create(p.Cantidad().Value))
                await this.productRepository.updateProductAggregate(result.Value)
            }

            const combos = event.bundles

            for (const c of combos) {
                const result = await this.bundleRepository.findBundleById(c.Id.Value)
                result.Value.decreaseStock(BundleStock.create(c.Cantidad().Value))
                await this.bundleRepository.addBundle(result.Value)
            }

        }, 'Decrementar el stock')

        // Persistencia de la base de datos para los detalles de una orden
        await this.eventBus.subscribe('OrderCreated', async (event: OrderCreated) => {
            const service =
                new ExceptionDecorator(
                    new LoggingDecorator(
                        new CreateDetalleService(
                            this.detalleRepository,
                            this.orderRepository,
                            this.productRepository,
                            this.bundleRepository,
                            new ProductMapper(
                                new OrmCategoryMapper(),
                                this.categoryRepository,
                            ),
                            this.idGenerator
                        ),
                        new NativeLogger(this.logger)
                    ),
                    new HttpExceptionHandler()
                )

            const data = {
                userId: user.id,
                id_orden: event.id,
                detalle_productos: event.productos.map((detalle) => ({
                    id_producto: detalle.Id.Id,
                    cantidad: detalle.Cantidad().Value
                })),
                detalle_combos: event.bundles.map((detalle) => ({
                    id_combo: detalle.Id.Value,
                    cantidad: detalle.Cantidad().Value
                })),
            }

            await service.execute(data)
        }, 'Crear detalle orden service');

        const data: CreateOrderEntryServiceDTO = {
            userId: user.id,
            ...request,
            products: request.products,
            bundles: request.bundles
        };

        const service =
            new ExceptionDecorator(
                new LoggingDecorator(
                    new PerformanceDecorator(
                        new CreateOrderService(
                            this.orderRepository,
                            this.productRepository,
                            this.bundleRepository,
                            this.cuponReporitory,
                            this.discountRepository,
                            this.idGenerator,
                            this.eventBus,
                            new OrderCalculationTotal(
                                new PaypalPaymentMethod(
                                    request.email,
                                    this.idGenerator
                                ),
                                this.taxes,
                                new ShippingFeeDistance()
                            )
                        ),
                        new NativeLogger(this.logger)
                    ),
                    new NativeLogger(this.logger)
                ),
                new HttpExceptionHandler()
            )

        const result = await service.execute(data)

        const response: CreateOrderResponseDTO = {
            ...result.Value
        }

        return response
    }

    @Post('pay/stripe')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({
        description: 'Crea la orden con stripe',
        type: CreateOrderResponseDTO
    })
    async orderPayStripe(
        @GetUser() user,
        @Body() request: CreateOrderStripeEntryDTO,
    ) {

        // Envia correo electronico para informar de la creacion de la orden
        await this.eventBus.subscribe('OrderCreated', async (event: OrderCreated) => {
            const sender = new NodemailerEmailSender();
            const order_id = event.id;
            sender.sendEmail(user.email, user.name, order_id);
        }, 'Notificar orden de compra');

        // Decrementa el stock de los productos elegidos en la orden
        await this.eventBus.subscribe('OrderCreated', async (event: OrderCreated) => {
            console.log("Se publico el evento para decrementar los productos")

            const productos = event.productos

            for (const p of productos) {
                const result = await this.productRepository.findProductById(p.Id.Id)
                result.Value.decreaseStock(ProductStock.create(p.Cantidad().Value))
                await this.productRepository.updateProductAggregate(result.Value)
            }

            const combos = event.bundles

            for (const c of combos) {
                const result = await this.bundleRepository.findBundleById(c.Id.Value)
                result.Value.decreaseStock(BundleStock.create(c.Cantidad().Value))
                await this.bundleRepository.addBundle(result.Value)
            }

        }, 'Decrementar el stock')

        // Persistencia de la base de datos para los detalles de una orden
        await this.eventBus.subscribe('OrderCreated', async (event: OrderCreated) => {
            const service =
                new ExceptionDecorator(
                    new LoggingDecorator(
                        new PerformanceDecorator(
                            new CreateDetalleService(
                                this.detalleRepository,
                                this.orderRepository,
                                this.productRepository,
                                this.bundleRepository,
                                new ProductMapper(
                                    new OrmCategoryMapper(),
                                    this.categoryRepository,
                                ),
                                this.idGenerator
                            ),
                            new NativeLogger(this.logger)
                        ),
                        new NativeLogger(this.logger)
                    ),
                    new HttpExceptionHandler()
                )

            const data = {
                userId: user.id,
                id_orden: event.id,
                detalle_productos: event.productos.map((detalle) => ({
                    id_producto: detalle.Id.Id,
                    cantidad: detalle.Cantidad().Value
                })),
                detalle_combos: event.bundles.map((detalle) => ({
                    id_combo: detalle.Id.Value,
                    cantidad: detalle.Cantidad().Value
                })),
            }


            await service.execute(data)
        }, 'Crear detalle orden service');

        const data: CreateOrderEntryServiceDTO = {
            userId: user.id,
            ...request,
            products: request.products,
            bundles: request.bundles
        };

        const service =
            new ExceptionDecorator(
                new LoggingDecorator(
                    new PerformanceDecorator(
                        new CreateOrderService(
                            this.orderRepository,
                            this.productRepository,
                            this.bundleRepository,
                            this.cuponReporitory,
                            this.discountRepository,
                            this.idGenerator,
                            this.eventBus,
                            new OrderCalculationTotal(
                                new StripePaymentMethod(
                                    request.token,
                                    this.idGenerator,
                                    this.paymentMethodRepository,
                                    request.idPayment
                                ),
                                this.taxes,
                                new ShippingFeeDistance()
                            )
                        ),
                        new NativeLogger(this.logger)
                    ),
                    new NativeLogger(this.logger)
                ),
                new HttpExceptionHandler()
            )

        const result = await service.execute(data)

        const response: CreateOrderResponseDTO = {
            ...result.Value
        }

        return response
    }

    @Get('many')
    @ApiOkResponse({
        description: 'Devuelve la informacion de todas las ordenes',
        type: GetAllOrdersReponseDTO,
        isArray: true
    })
    async getAllOrders(
        @Query() pagination: PaginationDto
    ) {

        const data: GetAllOrdersServiceEntryDTO = {
            userId: '',
            page: pagination.page,
            limit: pagination.perpage
        }

        const service =
            new ExceptionDecorator(
                new LoggingDecorator(
                    new PerformanceDecorator(
                        new GetAllOrdersService(
                            this.orderRepository
                        ),
                        new NativeLogger(this.logger)
                    ),
                    new NativeLogger(this.logger)
                ),
                new HttpExceptionHandler()
            )

        const result = await service.execute(data)

        const response: GetAllOrdersReponseDTO[] = {
            ...result.Value
        }

        return response

    }

    @Get('many/past/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOkResponse({
        description: 'Devuelve la informacion de todas las ordenes pasadas de un usuario',
        type: GetAllOrdersReponseDTO,
        isArray: true
    })
    async getPastOrdersByUser(
        @GetUser() user,
        @Param('id', ParseUUIDPipe) id: string
    ) {

        const data: GetPastOrdersServiceEntryDTO = {
            userId: id
        }

        const service =
            new ExceptionDecorator(
                new LoggingDecorator(
                    new PerformanceDecorator(
                        new GetPastOrdersService(
                            this.orderRepository
                        ),
                        new NativeLogger(this.logger)
                    ),
                    new NativeLogger(this.logger)
                ),
                new HttpExceptionHandler()
            )

        const result = await service.execute(data)

        const response: GetAllOrdersReponseDTO[] = {
            ...result.Value
        }

        return response

    }

    @Get('many/active/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOkResponse({
        description: 'Devuelve la informacion de todas las ordenes activas de un usuario',
        type: GetAllOrdersReponseDTO,
        isArray: true
    })
    async getActiveOrdersByUser(
        @GetUser() user,
        @Param('id', ParseUUIDPipe) id: string,
    ) {

        console.log(id)

        const data: GetActiveOrdersServiceEntryDTO = {
            userId: id
        }

        const service =
            new ExceptionDecorator(
                new LoggingDecorator(
                    new PerformanceDecorator(
                        new GetActiveOrdersService(
                            this.orderRepository
                        ),
                        new NativeLogger(this.logger)
                    ),
                    new NativeLogger(this.logger)
                ),
                new HttpExceptionHandler()
            )

        const result = await service.execute(data)

        const response: GetAllOrdersReponseDTO[] = {
            ...result.Value
        }

        return response

    }

    @Post('change/state')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOkResponse({
        description: 'Cambia el estado de una orden',
        type: ChangeOrderStateResponseDTO,
    })
    async changeState(
        @GetUser() user,
        @Body() request: ChangeOrderStateEntryDTO
    ) {

        const data: ChangeOrderServiceEntryDTO = {
            userId: user.id,
            ...request
        }

        const service =
            new ExceptionDecorator(
                new LoggingDecorator(
                    new PerformanceDecorator(
                        new ChangeOrderStateService(
                            this.orderRepository,
                            this.eventBus
                        ),
                        new NativeLogger(this.logger)
                    ),
                    new NativeLogger(this.logger)
                ),
                new HttpExceptionHandler()
            )

        const result = await service.execute(data)

        const response: ChangeOrderServiceResponseDTO = {
            ...result.Value
        }

        return response

    }

    @Post('report')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOkResponse({
        description: 'Crear un reporte para la orden',
        type: CreateReportResponseDTO,
    })
    async createReport(
        @GetUser() user,
        @Body() request: CreateReportEntryDTO
    ) {

        const data: CreateReportServiceEntryDTO = {
            userId: user.id,
            id_orden: request.id_orden,
            texto: request.texto
        }

        const service =
            new ExceptionDecorator(
                new LoggingDecorator(
                    new PerformanceDecorator(
                        new CreateReportService(
                            this.orderRepository,
                            this.idGenerator
                        ),
                        new NativeLogger(this.logger)
                    ),
                    new NativeLogger(this.logger)
                ),
                new HttpExceptionHandler()
            )

        const result = await service.execute(data)

        const response: CreateReportResponseDTO = {
            ...result.Value
        }

        return response

    }

    @Get('HERE')
    async testHere() {
        const ubicacion = OrderLocationDelivery.create(
            "ojsafa",
            10.521805,
            -66.93847,
        )

        const stripe = new Stripe(process.env.STRIPE_API_SECRET)
        const paymentIntent = await stripe.paymentIntents.create({
            amount: 10 * 100,  // Monto en centavos (usd * 100)
            currency: 'usd',
            confirm: true,
            payment_method: "pm_card_visa",
            payment_method_types: ['card'],
            metadata: {
                id_pago: '550e8400-e29b-41d4-a716-446655440000',  // Un identificador personalizado
            }
        });

        // Primero, obtenemos los PaymentIntents
        const paymentIntents = await stripe.paymentIntents.list({
            limit: 100,  // Puedes ajustar el límite según tus necesidades o usar paginación
        });

        // Luego, filtramos los resultados usando el campo de metadata
        const filteredPaymentIntents = paymentIntents.data.filter((paymentIntent) => {
            return paymentIntent.metadata.id_pago === '550e8400-e29b-41d4-a716-446655440000';  // ID personalizado que buscaste
        });

        if (filteredPaymentIntents.length > 0) {
            const paymentIntent = filteredPaymentIntents[0];  // Tomamos el primer resultado encontrado
            console.log('PaymentIntent encontrado:', paymentIntent);

            // Realizamos el reembolso con el PaymentIntent encontrado
            const reembolso = await stripe.refunds.create({
                payment_intent: paymentIntent.id
            });
            console.log('Reembolso procesado:', reembolso);
        } else {
            console.log('No se encontró el PaymentIntent con ese ID de pago.');
        }

        //this.shippingFee.execute(ubicacion,undefined)
    }

}