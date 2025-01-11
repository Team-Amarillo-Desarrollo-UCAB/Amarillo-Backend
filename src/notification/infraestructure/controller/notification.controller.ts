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

    constructor(
        @Inject('DataSource') private readonly dataSource: DataSource,
    ) {
        this.logger = new Logger('NotificationController')
        this.notiAddressRepository = new OrmNotificationAddressRepository(dataSource)
        this.notiAlertRepository = new OrmNotificationAlertRepository(dataSource)
        this.uuidGenerator = new UuidGenerator()
        this.categoryMapper = new OrmCategoryMapper()
        this.pushNotifier = FirebaseNotifier.getInstance()
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
        
    }

    @Post('savetoken')
    @UseGuards(JwtAuthGuard)
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

   // @Cron(CronExpression.EVERY_DAY_AT_7AM)
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
    async productsAnnouncementNotification(@Query() productsNamesDTO: NotifyProductsByNamesServiceEntryInfrastructureDTO){

        const service = new ExceptionDecorator( 
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
            ),
            new HttpExceptionHandler()
        )

        const entry: NotifyProductsByNamesServiceEntryDTO={
            userId: 'none',
            ...productsNamesDTO
        }

        const r = await service.execute(entry)

        return r.Value

    }
    

}