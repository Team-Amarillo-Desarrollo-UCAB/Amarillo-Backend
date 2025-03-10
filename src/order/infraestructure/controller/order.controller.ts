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
    Patch,
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
import { RefundOrderResponseDTO } from "../DTO/response/refund-order-response.dto";
import { RefundOrderServiceEntryDTO } from "src/order/application/DTO/entry/refund-order-service.entry.dto";
import { RefundOrderService } from "src/order/application/services/command/refund-order.service";
import { StripeOrderReembolsoAdapter } from "src/common/infraestructure/domain-services-adapters/order-reembolso.adapter";
import { GetAllOrdersEntryDTO } from "../DTO/entry/get-all-orders-entry.dto";
import { FirebaseNotifier } from "src/notification/infraestructure/notifier/firebase-notifier";
import { CreateOrderEntryDTO } from "../DTO/entry/create-order-entry-dto";
import { IPaymentMethod } from "src/common/domain/domain-service/determinar-metodo-pago.interface";
import { CashPaymentMethod } from "src/common/infraestructure/payment/cash-payment-method";
import { CreateOrderCashEntryDTO } from "../DTO/entry/create-order-cash-entry.dto";
import { UpdateOrderInformationEntryDTO } from "../DTO/entry/update-order-information-entry.dto";
import { UpdateOrderInformationResponseDTO } from "../DTO/response/update-order-information-response.dto";
import { UpdateOrderInformationServiceEntryDTO } from "src/order/application/DTO/entry/update-order-information-service-entry.dto";
import { UpdateOrderInformationService } from "src/order/application/services/command/update-order-information.service";
import { PaymentMethodName } from "src/payment-method/domain/value-objects/payment-method-name";
import { OrderStateChanged } from "src/order/domain/domain-event/order-state-changed";
import { NotifyChangeStateOrderService } from "src/notification/infraestructure/services/notification-services/notify-change-state-order.service";
import { INotificationAlertRepository } from "src/notification/infraestructure/interface/notification-alert-repository.interface";
import { INotificationAddressRepository } from "src/notification/infraestructure/interface/notification-address-repository.interface";
import { OrmNotificationAddressRepository } from "src/notification/infraestructure/repositories/orm-notification-address-repository";
import { OrmNotificationAlertRepository } from "src/notification/infraestructure/repositories/orm-notification-alert-repository";
import { NotifyRefundOrderService } from "src/notification/infraestructure/services/notification-services/notify-refund-order.service";
import { OrderRefunded } from "src/order/domain/domain-event/order-refunded-event";
import { OrmAuditingRepository } from "src/common/infraestructure/auditing/repositories/orm-auditing-repository";
import { AuditingDecorator } from "src/common/application/application-services/decorators/auditing-decorator/auditing.decorator";
import { SecurityDecorator } from "src/common/application/application-services/decorators/security-decorator/security-decorator";
import { OrmAccountRepository } from "src/user/infraestructure/repositories/orm-repositories/orm-account-repository";
import { NotifyOrderCreatedService } from "src/notification/infraestructure/services/notification-services/notify-created-order.service";
import { NotifyCreatedOrderServiceEntryDTO } from "src/notification/infraestructure/services/dto/entry/notify-created-order-service-entry.dto";
import { OrderBillRecivied } from "src/order/domain/domain-event/order-bill-recivied";

@ApiTags("Order")
@Controller("order")
export class OrderController {

    private readonly idGenerator: IdGenerator<string>
    private readonly eventBus = RabbitEventBus.getInstance();
    private readonly firebaseNotifier = FirebaseNotifier.getInstance()
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
    private readonly notiAddressRepository: INotificationAddressRepository
    private readonly notiAlertRepository: INotificationAlertRepository
    private readonly auditingRepository: OrmAuditingRepository
    private readonly accountUserRepository: OrmAccountRepository;

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
        this.notiAddressRepository = new OrmNotificationAddressRepository(dataSource)
        this.notiAlertRepository = new OrmNotificationAlertRepository(dataSource)
        this.auditingRepository = new OrmAuditingRepository(dataSource)
        this.accountUserRepository = new OrmAccountRepository(dataSource)

    }

    @Get('one/:id')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({
        description: 'Devuelve la informacion de una orden dado el id',
        type: GetOrderByIdReponseDTO
    })
    async getOrder(
        @GetUser() user,
        @Param('id', ParseUUIDPipe) id: string,
    ) {

        const allowedRoles = ['ADMIN', 'CLIENT'];

        const data: GetOrderByIdEntryServiceDTO = {
            userId: user.id,
            id_orden: id
        }

        const service =
            new ExceptionDecorator(
                new AuditingDecorator(
                    new SecurityDecorator(
                        new LoggingDecorator(
                            new PerformanceDecorator(
                                new GetOrderByIdService(
                                    this.orderRepository
                                ),
                                new NativeLogger(this.logger)
                            ),
                            new NativeLogger(this.logger)
                        ),
                        this.accountUserRepository,
                        allowedRoles
                    ),
                    this.auditingRepository,
                    this.idGenerator
                ),
                new HttpExceptionHandler()
            );

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

    @Post('create')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({
        description: 'Crea la orden con el metodo de pago de PayPal',
        type: CreateOrderResponseDTO
    })
    async createOrder(
        @GetUser() user,
        @Body() request: CreateOrderEntryDTO,
    ) {

        //const metodo = PaymentMethodName.create(request.paymentMethod)

        let adapter: IPaymentMethod = new CashPaymentMethod(
            this.idGenerator,
            this.paymentMethodRepository,
            //PaymentMethodName.create(request.paymentMethod),
            request.idPayment
        )

        if (request.email) {
            adapter = new PaypalPaymentMethod(
                request.email,
                this.idGenerator,
                this.paymentMethodRepository,
                //PaymentMethodName.create(request.paymentMethod),
                request.idPayment
            )
        }

        if (request.token) {
            adapter = new StripePaymentMethod(
                request.token,
                this.idGenerator,
                this.paymentMethodRepository,
                //PaymentMethodName.create(request.paymentMethod),
                request.idPayment,
            )
        }

        // Envia correo electronico para informar de la creacion de la orden
        await this.eventBus.subscribe('OrderCreated', async (event: OrderCreated) => {
            const sender = new NodemailerEmailSender();
            const order_id = event.id;
            const data_productos = []
            event.productos.map(p => {
                data_productos.push(
                    {
                        name: p.Name().Value,
                        image: p.Image().Image,
                        quantity: p.Cantidad().Value
                    }
                )
            })
            event.bundles.map(c => {
                data_productos.push(
                    {
                        name: c.Name().Value,
                        image: c.Image().Image,
                        quantity: c.Cantidad().Value
                    }
                )
            })
            console.log("Receptor: ", user.email)
            sender.sendEmail(user.email, user.name, order_id, data_productos);
        }, 'Notificar orden de compra');


        // Envia notificacion push sobre la creacion de la orden
        await this.eventBus.subscribe('OrderCreated', async (event: OrderCreated) => {
            const service = new NotifyOrderCreatedService(
                this.notiAddressRepository,
                this.notiAlertRepository,
                this.orderRepository,
                this.idGenerator,
                FirebaseNotifier.getInstance()
            )
            const entry: NotifyCreatedOrderServiceEntryDTO = {
                userId: user.id,
                id_orden: event.id
            }
            const response = await service.execute(entry)
            console.log("Resultado servicio: ", response.isSuccess())
        }, 'Notificar via push por orden creada');


        // Decrementa el stock de los productos elegidos en la orden
        await this.eventBus.subscribe('OrderCreated', async (event: OrderCreated) => {

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

        // Envia correo electronico para informar de la creacion de la orden
        await this.eventBus.subscribe('OrderBillRecivied', async (event: OrderBillRecivied) => {
            console.log("Evento en ejecucion: ", event)
            const sender = new NodemailerEmailSender();
            sender.sendCharge(user.email, user.name, event.id, event.factura);
        }, 'Notificar factura de la orden');


        const allowedRoles = ['ADMIN', 'CLIENT'];

        const data: CreateOrderEntryServiceDTO = {
            userId: user.id,
            ...request,
            products: request.products,
            bundles: request.combos
        };

        const service =
            new ExceptionDecorator(
                new AuditingDecorator(
                    new SecurityDecorator(
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
                                        adapter,
                                        this.taxes,
                                        new ShippingFeeDistance()
                                    )
                                ),
                                new NativeLogger(this.logger)
                            ),
                            new NativeLogger(this.logger)
                        ),
                        this.accountUserRepository,
                        allowedRoles
                    ),
                    this.auditingRepository,
                    this.idGenerator
                ),
                new HttpExceptionHandler()
            )

        const result = await service.execute(data)

        const response: CreateOrderResponseDTO = {
            ...result.Value
        }

        return response

    }

    @Post('pay/cash')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({
        description: 'Crea la orden con el metodo de pago Efectivo',
        type: CreateOrderResponseDTO
    })
    async orderCash(
        @GetUser() user,
        @Body() request: CreateOrderCashEntryDTO,
    ) {

        // Envia correo electronico para informar de la creacion de la orden
        await this.eventBus.subscribe('OrderCreated', async (event: OrderCreated) => {
            const sender = new NodemailerEmailSender();
            const order_id = event.id;
            console.log("Receptor: ", user.email)
            sender.sendEmail(user.email, user.name, order_id);
        }, 'Notificar orden de compra');

        // Envia notificacion push sobre la creacion de la orden
        await this.eventBus.subscribe('OrderCreated', async (event: OrderCreated) => {
            const service = new NotifyOrderCreatedService(
                this.notiAddressRepository,
                this.notiAlertRepository,
                this.orderRepository,
                this.idGenerator,
                FirebaseNotifier.getInstance()
            )
            const entry: NotifyCreatedOrderServiceEntryDTO = {
                userId: user.id,
                id_orden: event.id
            }
            const response = await service.execute(entry)
            console.log("Resultado servicio: ", response.isSuccess())
        }, 'Notificar via push por orden creada');

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

        const data: CreateOrderEntryServiceDTO = {
            userId: user.id,
            ...request,
            products: request.products,
            bundles: request.combos
        };

        const allowedRoles = ['ADMIN', 'CLIENT'];

        const service =
            new ExceptionDecorator(
                new AuditingDecorator(
                    new SecurityDecorator(
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
                                        new CashPaymentMethod(
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
                        this.accountUserRepository,
                        allowedRoles
                    ),
                    this.auditingRepository,
                    this.idGenerator
                ),
                new HttpExceptionHandler()
            )

        const result = await service.execute(data)

        const response: CreateOrderResponseDTO = {
            ...result.Value
        }

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

        // Envia notificacion push sobre la creacion de la orden
        await this.eventBus.subscribe('OrderCreated', async (event: OrderCreated) => {
            const service = new NotifyOrderCreatedService(
                this.notiAddressRepository,
                this.notiAlertRepository,
                this.orderRepository,
                this.idGenerator,
                FirebaseNotifier.getInstance()
            )
            const entry: NotifyCreatedOrderServiceEntryDTO = {
                userId: user.id,
                id_orden: event.id
            }
            const response = await service.execute(entry)
            console.log("Resultado servicio: ", response.isSuccess())
        }, 'Notificar via push por orden creada');

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

        const data: CreateOrderEntryServiceDTO = {
            userId: user.id,
            ...request,
            products: request.products,
            bundles: request.combos
        };

        const allowedRoles = ['ADMIN', 'CLIENT'];

        const service =
            new ExceptionDecorator(
                new AuditingDecorator(
                    new SecurityDecorator(
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
                        this.accountUserRepository,
                        allowedRoles
                    ),
                    this.auditingRepository,
                    this.idGenerator
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

        // Envia notificacion push sobre la creacion de la orden
        await this.eventBus.subscribe('OrderCreated', async (event: OrderCreated) => {
            const service = new NotifyOrderCreatedService(
                this.notiAddressRepository,
                this.notiAlertRepository,
                this.orderRepository,
                this.idGenerator,
                FirebaseNotifier.getInstance()
            )
            const entry: NotifyCreatedOrderServiceEntryDTO = {
                userId: user.id,
                id_orden: event.id
            }
            const response = await service.execute(entry)
            console.log("Resultado servicio: ", response.isSuccess())
        }, 'Notificar via push por orden creada');

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

        // Envia correo electronico para informar de la creacion de la orden
        await this.eventBus.subscribe('OrderBillRecivied', async (event: OrderBillRecivied) => {
            console.log("Evento en ejecucion: ", event)
            const sender = new NodemailerEmailSender();
            sender.sendCharge(user.email, user.name, event.id, event.factura);
        }, 'Notificar factura de la orden');

        const data: CreateOrderEntryServiceDTO = {
            userId: user.id,
            ...request,
            products: request.products,
            bundles: request.combos
        };

        const allowedRoles = ['ADMIN', 'CLIENT'];

        const service =
            new ExceptionDecorator(
                new AuditingDecorator(
                    new SecurityDecorator(
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
                                            request.idPayment,
                                        ),
                                        this.taxes,
                                        new ShippingFeeDistance()
                                    )
                                ),
                                new NativeLogger(this.logger)
                            ),
                            new NativeLogger(this.logger)
                        ),
                        this.accountUserRepository,
                        allowedRoles
                    ),
                    this.auditingRepository,
                    this.idGenerator
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
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOkResponse({
        description: 'Devuelve la informacion de todas las ordenes',
        type: GetAllOrdersReponseDTO,
        isArray: false
    })
    async getAllOrders(
        @Query() request: GetAllOrdersEntryDTO,
        @Query() pagination: PaginationDto,
        @GetUser() user
    ) {

        if (!Array.isArray(request.status)) {
            request.status = [request.status];
        }

        const data: GetAllOrdersServiceEntryDTO = {
            userId: user.id,
            page: pagination.page,
            limit: pagination.perpage,
            status: request.status
        }

        const allowedRoles = ['ADMIN', 'CLIENT'];

        const service =
            new ExceptionDecorator(
                new AuditingDecorator(
                    new SecurityDecorator(
                        new LoggingDecorator(
                            new PerformanceDecorator(
                                new GetAllOrdersService(
                                    this.orderRepository
                                ),
                                new NativeLogger(this.logger)
                            ),
                            new NativeLogger(this.logger)
                        ),
                        this.accountUserRepository,
                        allowedRoles
                    ),
                    this.auditingRepository,
                    this.idGenerator
                ),
                new HttpExceptionHandler()
            )

        const result = await service.execute(data)

        const response = {
            orders: result.Value.map(order => ({
                id: order.id,
                orderState: order.orderState,
                orderCreatedDate: order.orderCreatedDate,
                totalAmount: order.totalAmount,
                sub_total: order.sub_total,
                shipping_fee: order.shipping_fee,
                currency: order.currency,
                orderDirection: order.orderDirection,
                directionName: order.directionName,
                products: order.products,
                bundles: order.bundles,
                orderReciviedDate: order.orderReciviedDate,
                orderReport: order.orderReport,
                orderPayment: order.orderPayment,
                orderDiscount: order.orderDiscount,
                instructions: order.instructions
            }))
        };

        console.log("Ordenes: ", response)
        return response;
    }

    @Get('many/past')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOkResponse({
        description: 'Devuelve la informacion de todas las ordenes pasadas de un usuario',
        type: GetAllOrdersReponseDTO,
        isArray: true
    })
    async getPastOrdersByUser(
        @Query() pagination: PaginationDto,
        @GetUser() user
    ) {

        const data: GetPastOrdersServiceEntryDTO = {
            userId: user.id,
            page: pagination.page,
            perPage: pagination.perpage
        }

        const allowedRoles = ['ADMIN', 'CLIENT'];

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

        const response = {
            ordenes: result.Value.map(order => ({
                id: order.id,
                orderState: order.orderState,
                orderCreatedDate: order.orderCreatedDate,
                totalAmount: order.totalAmount,
                sub_total: order.sub_total,
                shipping_fee: order.shipping_fee,
                currency: order.currency,
                orderDirection: order.orderDirection,
                directionName: order.directionName,
                products: order.products,
                bundles: order.bundles,
                orderReciviedDate: order.orderReciviedDate,
                orderReport: order.orderReport,
                orderPayment: order.orderPayment,
                orderDiscount: order.orderDiscount,
                instructions: order.instructions
            }))
        };
        return response;

    }

    @Get('many/active')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOkResponse({
        description: 'Devuelve la informacion de todas las ordenes activas de un usuario',
        type: GetAllOrdersReponseDTO,
        isArray: true
    })
    async getActiveOrdersByUser(
        @Query() pagination: PaginationDto,
        @GetUser() user
    ) {

        const data: GetActiveOrdersServiceEntryDTO = {
            userId: user.id,
            page: pagination.page,
            perPage: pagination.perpage
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

        const response = {
            ordenes: result.Value.map(order => ({
                id: order.id,
                orderState: order.orderState,
                orderCreatedDate: order.orderCreatedDate,
                totalAmount: order.totalAmount,
                sub_total: order.sub_total,
                shipping_fee: order.shipping_fee,
                currency: order.currency,
                orderDirection: order.orderDirection,
                directionName: order.directionName,
                products: order.products,
                bundles: order.bundles,
                orderReciviedDate: order.orderReciviedDate,
                orderReport: order.orderReport,
                orderPayment: order.orderPayment,
                orderDiscount: order.orderDiscount,
                instructions: order.instructions
            }))
        };
        return response;

    }

    @Patch('change/state/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOkResponse({
        description: 'Cambia el estado de una orden',
        type: ChangeOrderStateResponseDTO,
    })
    async changeState(
        @GetUser() user,
        @Param('id', ParseUUIDPipe) id: string,
        @Body() request: ChangeOrderStateEntryDTO
    ) {

        // Envia notificacion push sobre el cambio de estado
        await this.eventBus.subscribe('OrderStateChanged', async (event: OrderStateChanged) => {
            const service = new NotifyChangeStateOrderService(
                this.notiAddressRepository,
                this.notiAlertRepository,
                this.orderRepository,
                this.idGenerator,
                FirebaseNotifier.getInstance()
            )
            const entry = {
                userId: user.id,
                id_orden: event.id,
                estado: event.estado
            }
            const response = await service.execute(entry)
            console.log("Resultado servicio: ", response.isSuccess())
        }, 'Notificar cambio de estado');

        const data: ChangeOrderServiceEntryDTO = {
            userId: user.id,
            id_order: id,
            ...request
        }

        const allowedRoles = ['ADMIN', 'CLIENT'];

        const service =
            new ExceptionDecorator(
                new AuditingDecorator(
                    new SecurityDecorator(
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
                        this.accountUserRepository,
                        allowedRoles
                    ),
                    this.auditingRepository,
                    this.idGenerator
                ),
                new HttpExceptionHandler()
            )

        const result = await service.execute(data)

        const response: ChangeOrderServiceResponseDTO = {
            ...result.Value
        }

        return response

    }

    @Patch('report/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOkResponse({
        description: 'Crear un reporte para la orden',
        type: CreateReportResponseDTO,
    })
    async createReport(
        @GetUser() user,
        @Param('id', ParseUUIDPipe) id: string,
        @Body() request: CreateReportEntryDTO
    ) {

        const data: CreateReportServiceEntryDTO = {
            userId: user.id,
            id_orden: id,
            texto: request.texto
        }

        const allowedRoles = ['ADMIN', 'CLIENT'];

        const service =
            new ExceptionDecorator(
                new AuditingDecorator(
                    new SecurityDecorator(
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
                        this.accountUserRepository,
                        allowedRoles
                    ),
                    this.auditingRepository,
                    this.idGenerator
                ),
                new HttpExceptionHandler()
            )

        const result = await service.execute(data)

        const response: CreateReportResponseDTO = {
            ...result.Value
        }

        return response

    }

    @Post('refund/stripe/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOkResponse({
        description: 'Solicita el reembolso de una orden cancelada o entregada',
        type: RefundOrderResponseDTO,
    })
    async refundOrder(
        @GetUser() user,
        @Param('id', ParseUUIDPipe) id: string
    ) {

        // Envia notificacion push sobre el cambio de estado
        await this.eventBus.subscribe('OrderRefunded', async (event: OrderRefunded) => {
            const service = new NotifyRefundOrderService(
                this.notiAddressRepository,
                this.notiAlertRepository,
                this.orderRepository,
                this.idGenerator,
                FirebaseNotifier.getInstance()
            )
            const entry = {
                userId: user.id,
                id_orden: event.id,
                monto_reembolsado: event.monto
            }
            const response = await service.execute(entry)
            console.log("Resultado servicio: ", response.isSuccess())
        }, 'Notificar reembolso de la orden');

        // Envia correo electronico para informar de la creacion de la orden
        await this.eventBus.subscribe('OrderRefunded', async (event: OrderRefunded) => {
            console.log("Evento en ejecucion: ", event)
            const sender = new NodemailerEmailSender();
            sender.sendChargeRefund(user.email, user.name, event.id, event.factura);
        }, 'Notificar factura de la orden');

        const data: RefundOrderServiceEntryDTO = {
            userId: user.id,
            id_orden: id
        }

        const allowedRoles = ['ADMIN', 'CLIENT'];

        const service =
            new ExceptionDecorator(
                new AuditingDecorator(
                    new SecurityDecorator(
                        new LoggingDecorator(
                            new PerformanceDecorator(
                                new RefundOrderService(
                                    this.orderRepository,
                                    new StripeOrderReembolsoAdapter(),
                                    this.eventBus
                                ),
                                new NativeLogger(this.logger)
                            ),
                            new NativeLogger(this.logger)
                        ),
                        this.accountUserRepository,
                        allowedRoles
                    ),
                    this.auditingRepository,
                    this.idGenerator
                ),
                new HttpExceptionHandler()
            )

        const result = await service.execute(data)

        const response: RefundOrderResponseDTO = {
            ...result.Value
        }

        return response

    }

    @Patch('update')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOkResponse({
        description: 'Cambia la fecha de entrega o la direccion de entrega',
        type: UpdateOrderInformationResponseDTO,
    })
    async updateOrder(
        @GetUser() user,
        @Body() request: UpdateOrderInformationEntryDTO
    ) {

        const data: UpdateOrderInformationServiceEntryDTO = {
            userId: user.id,
            ...request
        }

        const allowedRoles = ['ADMIN', 'CLIENT'];

        const service =
            new ExceptionDecorator(
                new AuditingDecorator(
                    new SecurityDecorator(
                        new LoggingDecorator(
                            new PerformanceDecorator(
                                new UpdateOrderInformationService(
                                    this.orderRepository,
                                    this.eventBus
                                ),
                                new NativeLogger(this.logger)
                            ),
                            new NativeLogger(this.logger)
                        ),
                        this.accountUserRepository,
                        allowedRoles
                    ),
                    this.auditingRepository,
                    this.idGenerator
                ),
                new HttpExceptionHandler()
            )

        const result = await service.execute(data)

        const response: UpdateOrderInformationResponseDTO = {
            ...result.Value
        }

        return response

    }

    @Get('Test')
    async test() {
        const sender = new NodemailerEmailSender();
        const order_id = '';
        const data = [{
            name: 'Esponja',
            image: "https://res.cloudinary.com/dxttqmyxu/image/upload/v1731484347/irt7dk0xphtffonboewo.png",
            quantity: 2
        },
        {
            name: 'Babero',
            image: "https://res.cloudinary.com/dxttqmyxu/image/upload/v1731483722/ulx3mwxjckhuwexa76qe.webp",
            quantity: 2
        },
        {
            name: 'Babero',
            image: "https://res.cloudinary.com/dxttqmyxu/image/upload/v1731483722/ulx3mwxjckhuwexa76qe.webp",
            quantity: 2
        },
        {
            name: 'Babero',
            image: "https://res.cloudinary.com/dxttqmyxu/image/upload/v1731483722/ulx3mwxjckhuwexa76qe.webp",
            quantity: 2
        }]
        sender.sendEmail('labastidas.21@est.ucab.edu.ve', 'Luigi Bastidas', order_id, data);
    }


}