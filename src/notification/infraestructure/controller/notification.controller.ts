import { Body, Controller, Get, Inject, Logger, Param, Post, Query, UseGuards } from "@nestjs/common"
import { DataSource } from "typeorm"

import { IPushSender } from "src/common/application/push-sender/push-sender.interface"
import { INotificationAlertRepository } from "../interface/notification-alert-repository.interface"
import { INotificationAddressRepository } from "../interface/notification-address-repository.interface"
import { IdGenerator } from "src/common/application/id-generator/id-generator.interface"
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger"
import { OrmNotificationAddressRepository } from "../repositories/orm-notification-address-repository"
import { OrmNotificationAlertRepository } from "../repositories/orm-notification-alert-repository"
import { UuidGenerator } from "src/common/infraestructure/id-generator/uuid-generator"
import { FirebaseNotifier } from "../notifier/firebase-notifier"
import { JwtAuthGuard } from "src/auth/infraestructure/jwt/decorator/jwt-auth.guard"
import { SaveTokenAdressResponseDto } from "./dto/response/save-token-adress-response.dto"
import { SaveTokenAdressEntryDto } from "./dto/entry/save-token-adress-entry.dto"
import { GetUser } from "src/auth/infraestructure/jwt/decorator/get-user.param.decorator"
import { ExceptionDecorator } from "src/common/application/application-services/decorators/exception-decorator/exception.decorator"
import { LoggingDecorator } from "src/common/application/application-services/decorators/logging-decorator/logging.decorator"
import { PerformanceDecorator } from "src/common/application/application-services/decorators/performance-decorator/performance-decorator"
import { SaveTokenAddressInfraService } from "../services/command/save-token-address-services.service"
import { NativeLogger } from "src/common/infraestructure/logger/logger"
import { HttpExceptionHandler } from "src/common/infraestructure/exception-handler/http-exception-handler-code"
import { Cron, CronExpression } from "@nestjs/schedule"
import { NotifyGoodDayInfraService } from "../services/notification-services/notify-good-day-services.service"
import { NotifyProductsByNamesServiceEntryInfrastructureDTO } from "./dto/entry/notify-products-by-names-infra-entry.dto"
import { NotifyProductsByNameService } from "../services/notification-services/notify-products-by-name.service"
import { OrmProductRepository } from "src/product/infraestructure/repositories/product-repository"
import { OrmCategoryMapper } from "src/category/infraestructure/mappers/orm-category-mapper"
import { ProductMapper } from "src/product/infraestructure/mappers/product-mapper"
import { OrmCategoryRepository } from "src/category/infraestructure/repositories/orm-category-repository"
import { NotifyProductsByNamesServiceEntryDTO } from "../services/dto/entry/notify-products-by-names-entry.dto"
import { NotifyRecommendBundlesInfraService } from "../services/notification-services/notify-recommend-bundles-service.service"
import { OrmBundleRepository } from "src/bundle/infraestructure/repositories/orm-bundle.repository"
import { BundleMapper } from "src/bundle/infraestructure/mappers/bundle-mapper"
import { NotifyBundlesByNamesServiceEntryDTO } from "../services/dto/entry/notify-bundles-by-names-service.dto"
import { NotifyBundlesByNameService } from "../services/notification-services/notify-bundles-by-names.service"
import { NotifyBundlesByNamesServiceEntryInfrastructureDTO } from "./dto/entry/notify-bundles-by-name-infra-entry.dto"
import { NotifyRecommendProductsInfraService } from "../services/notification-services/notify-recommend-products.service"
import { OrmAccountRepository } from "src/user/infraestructure/repositories/orm-repositories/orm-account-repository"
import { OrmAuditingRepository } from "src/common/infraestructure/auditing/repositories/orm-auditing-repository"
import { SecurityDecorator } from "src/common/application/application-services/decorators/security-decorator/security-decorator"
import { userInfo } from "os"
import { NotifyChangeStateOrderEntryInfrastructureDTO } from "./dto/entry/notify-change-state-order-entry.dto"
import { NotifyChangeStateOrderService } from "../services/notification-services/notify-change-state-order.service"
import { NotifyChangeStateOrderServiceEntryDTO } from "../services/dto/entry/notify-change-state-order-service-entry.dto"
import { IOrderRepository } from "src/order/domain/repositories/order-repository.interface"
import { OrderRepository } from "src/order/infraestructure/repositories/order-repository"
import { OrderMapper } from "src/order/infraestructure/mappers/order-mapper"
import { PaymentMapper } from "src/order/infraestructure/mappers/payment-mapper"
import { ReportMapper } from "src/order/infraestructure/mappers/report-mapper"
import { GetManyNotificationByUserInfraService } from "../services/queries/get-all-notification-by-user.service"
import { GetNotificationsUserDto } from "./dto/entry/get-notification-by-user-entry.dto"
import { GetNotificationsUserSwaggerResponse } from "./dto/response/get-notifications-by-user-response.dto"

@ApiTags('Notification')
@Controller('notifications')
export class NotificationController {

    private readonly notiAddressRepository: INotificationAddressRepository
    private readonly notiAlertRepository: INotificationAlertRepository
    private readonly pushNotifier: IPushSender
    private readonly uuidGenerator: IdGenerator<string>
    private readonly productRepository: OrmProductRepository
    private readonly logger: Logger
    private readonly categoryMapper: OrmCategoryMapper
    private readonly bundleRepository: OrmBundleRepository;
    private readonly auditingRepository: OrmAuditingRepository;
    private readonly accountUserRepository: OrmAccountRepository;
    private readonly ordenRepository: IOrderRepository


    constructor(
        @Inject('DataSource') private readonly dataSource: DataSource,
    ) {
        this.logger = new Logger('NotificationController')
        this.notiAddressRepository = new OrmNotificationAddressRepository(dataSource)
        this.notiAlertRepository = new OrmNotificationAlertRepository(dataSource)
        this.uuidGenerator = new UuidGenerator()
        this.categoryMapper = new OrmCategoryMapper()
        this.pushNotifier = FirebaseNotifier.getInstance()
        this.auditingRepository = new OrmAuditingRepository(dataSource)
        this.accountUserRepository = new OrmAccountRepository(dataSource)
        this.productRepository = new OrmProductRepository(
            new ProductMapper(
                this.categoryMapper,
                new OrmCategoryRepository(
                    this.categoryMapper,
                    dataSource
                )
            ),
            this.dataSource
        )
        this.bundleRepository = new OrmBundleRepository(
            new BundleMapper(),
            this.dataSource//
        );
        this.ordenRepository = new OrderRepository(
            new OrderMapper(
                this.uuidGenerator,
                new PaymentMapper()
            ),
            new PaymentMapper(),
            new ReportMapper(),
            dataSource
        )

    }

    @Post('savetoken')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOkResponse({
        description: 'Registrar el token de direccion de un usuario',
        type: SaveTokenAdressResponseDto
    })
    @ApiBearerAuth()
    async saveToken(@Body() saveTokenDto: SaveTokenAdressEntryDto, @GetUser() user) {
        const data = { userId: user.id, ...saveTokenDto }
        const service =
            new ExceptionDecorator(
                new LoggingDecorator(
                    new PerformanceDecorator(
                        new SaveTokenAddressInfraService(this.notiAddressRepository),
                        new NativeLogger(this.logger)
                    ),
                    new NativeLogger(this.logger)
                ),
                new HttpExceptionHandler()
            )

        const result = await service.execute(data)

        const response: SaveTokenAdressResponseDto = {
            userId: result.Value.user_id,
            address: result.Value.token
        }

        return response
    }

    @Get('many')
    @ApiOkResponse({ 
        description: 'Obtener notificaciones de un usuario', 
        type: GetNotificationsUserSwaggerResponse
    })
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async getNotificationsByUser( @Query() getNotifications:GetNotificationsUserDto, @GetUser() user ) {
        let dataentry={ ...getNotifications, userId: user.id }
        const service = new ExceptionDecorator( 
            new LoggingDecorator(
                new PerformanceDecorator(    
                    new GetManyNotificationByUserInfraService(
                        this.notiAlertRepository
                    ),
                    new NativeLogger(this.logger)
                ),
                new NativeLogger(this.logger)
            ),
            new HttpExceptionHandler()
        )
        return (await service.execute(dataentry)).Value    
    }

    @Cron(CronExpression.EVERY_DAY_AT_10AM)
    @Get('goodday')
    async goodDayNotification() {
        const service = new ExceptionDecorator(
            new LoggingDecorator(
                new PerformanceDecorator(
                    new NotifyGoodDayInfraService(
                        this.notiAddressRepository,
                        this.notiAlertRepository,
                        this.uuidGenerator,
                        this.pushNotifier
                    ),
                    new NativeLogger(this.logger)
                ),
                new NativeLogger(this.logger)
            ),
            new HttpExceptionHandler()
        )
        return (await service.execute({ userId: 'none' })).Value
    }

    @Get('products-announcement')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async productsAnnouncementNotification(@Query() productsNamesDTO: NotifyProductsByNamesServiceEntryInfrastructureDTO, @GetUser() user) {

        if (!Array.isArray(productsNamesDTO.products_names)) {
            productsNamesDTO.products_names = [productsNamesDTO.products_names];
        }

        const allowedRoles = ['ADMIN']


        const service = new ExceptionDecorator(
            new SecurityDecorator(
                new LoggingDecorator(
                    new PerformanceDecorator(
                        new NotifyProductsByNameService(
                            this.notiAddressRepository,
                            this.notiAlertRepository,
                            this.productRepository,
                            this.uuidGenerator,
                            this.pushNotifier
                        ),
                        new NativeLogger(this.logger)
                    ),
                    new NativeLogger(this.logger)
                )
                , this.accountUserRepository,
                allowedRoles
            )
            ,
            new HttpExceptionHandler()
        )

        const entry: NotifyProductsByNamesServiceEntryDTO = {
            userId: user.id,
            ...productsNamesDTO
        }

        const r = await service.execute(entry)//

        return r.Value

    }

    @Cron(CronExpression.EVERY_DAY_AT_4PM)
    @Get('bundle-recommend')
    async recommendBundlesRandomNotification() {
        const service = new ExceptionDecorator(
            new LoggingDecorator(
                new PerformanceDecorator(
                    new NotifyRecommendBundlesInfraService(
                        this.notiAddressRepository,
                        this.notiAlertRepository,
                        this.bundleRepository,
                        this.uuidGenerator,
                        this.pushNotifier
                    ),
                    new NativeLogger(this.logger)
                ),
                new NativeLogger(this.logger)
            ),
            new HttpExceptionHandler()
        )


        return (await service.execute({ userId: 'none' })).Value
    }

    @Cron(CronExpression.EVERY_DAY_AT_4PM)
    @Get('product-recommend')
    async recommendProductsRandomNotification() {
        const service = new ExceptionDecorator(
            new LoggingDecorator(
                new PerformanceDecorator(
                    new NotifyRecommendProductsInfraService(
                        this.notiAddressRepository,
                        this.notiAlertRepository,
                        this.productRepository,
                        this.uuidGenerator,
                        this.pushNotifier
                    ),
                    new NativeLogger(this.logger)
                ),
                new NativeLogger(this.logger)
            ),
            new HttpExceptionHandler()
        )
        return (await service.execute({ userId: 'none' })).Value
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get('bundles-announcement')
    async bundlesAnnouncementNotification(@Query() bundlesNamesDTO: NotifyBundlesByNamesServiceEntryInfrastructureDTO, @GetUser() user) {

        if (!Array.isArray(bundlesNamesDTO.bundles_names)) {
            bundlesNamesDTO.bundles_names = [bundlesNamesDTO.bundles_names];
        }


        const allowedRoles = ['ADMIN']


        const service = new ExceptionDecorator(
            new SecurityDecorator(
                new LoggingDecorator(
                    new PerformanceDecorator(
                        new NotifyBundlesByNameService(
                            this.notiAddressRepository,
                            this.notiAlertRepository,
                            this.bundleRepository,
                            this.uuidGenerator,
                            this.pushNotifier
                        ),
                        new NativeLogger(this.logger)
                    ),
                    new NativeLogger(this.logger)
                )
                , this.accountUserRepository,
                allowedRoles
            )
            ,
            new HttpExceptionHandler()
        )

        const entry: NotifyBundlesByNamesServiceEntryDTO = {
            userId: user.id,
            ...bundlesNamesDTO
        };

        const r = await service.execute(entry);

        return r.Value;
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get('change-state')
    async orderChangeStateNotification(
        @Query() request: NotifyChangeStateOrderEntryInfrastructureDTO,
        @GetUser() user
    ) {

        const allowedRoles = ['ADMIN']


        const service = new ExceptionDecorator(
            new SecurityDecorator(
                new LoggingDecorator(
                    new PerformanceDecorator(
                        new NotifyChangeStateOrderService(
                            this.notiAddressRepository,
                            this.notiAlertRepository,
                            this.ordenRepository,
                            this.uuidGenerator,
                            this.pushNotifier
                        ),
                        new NativeLogger(this.logger)
                    ),
                    new NativeLogger(this.logger)
                )
                , this.accountUserRepository,
                allowedRoles
            )
            ,
            new HttpExceptionHandler()
        )

        const entry: NotifyChangeStateOrderServiceEntryDTO = {
            userId: user.id,
            id_orden: request.id,
            estado: request.status
        };

        const r = await service.execute(entry);

        return r.Value;
    }

}