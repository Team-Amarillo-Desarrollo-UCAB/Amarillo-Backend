import { OrmCategoryMapper } from './../../../category/infraestructure/mappers/orm-category-mapper';
import { ExceptionDecorator } from 'src/common/application/application-services/decorators/exception-decorator/exception.decorator';
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    BadRequestException,
    Body,
    Controller,
    Delete,
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
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { DataSource } from "typeorm";

import { GetProductResponseDTO } from "src/product/infraestructure/DTO/response/get-product-response.dto";
import { OrmProductRepository } from "../repositories/product-repository";
import { ProductMapper } from "../mappers/product-mapper";
import { LoggingDecorator } from "src/common/application/application-services/decorators/logging-decorator/logging.decorator";
import { GetProductByIdService } from "src/product/aplication/service/queries/get-product-by-id.service";
import { NativeLogger } from "src/common/infraestructure/logger/logger";
import { GetProductByIdServiceEntryDTO } from "src/product/aplication/DTO/entry/get-product-by-id-service-entry.dto";
import { GetUser } from "src/auth/infraestructure/jwt/decorator/get-user.param.decorator";
import { GetProductByNameServiceEntryDTO } from "src/product/aplication/DTO/entry/get-product-by-name-service-entry.dto";
import { GetProductByNameService } from "src/product/aplication/service/queries/get-product-by-name.service";
import { GetProductByNameResponseDTO } from "../DTO/response/get-product-by-name-response.dto";
import { CreateProductEntryDTO } from "../DTO/entry/create-product-entry.dto";
import { CreateProductServiceEntryDTO } from "src/product/aplication/DTO/entry/create-product-service-entry.dto";
import { CreateProductService } from "src/product/aplication/service/commands/create-product.service";
import { IdGenerator } from "src/common/application/id-generator/id-generator.interface";
import { UuidGenerator } from "src/common/infraestructure/id-generator/uuid-generator";
import { IProductRepository } from "src/product/domain/repositories/product-repository.interface";
import { HistoricoPrecioRepository } from "../repositories/historico-precio.repository";
import { CreateHistoricoPrecioService } from "../services/command/create-historico-precio.service";
import { MonedaRepository } from "../repositories/moneda.repository";
import { GetAllProductService } from "src/product/aplication/service/queries/get-all-product.service";
import { PaginationDto } from "src/common/infraestructure/dto/entry/pagination.dto";
import { GetAllProductServiceEntryDTO } from "src/product/aplication/DTO/entry/get-all-product-service-entry.dto";
import { GetAllProductsResponseDTO } from "../DTO/response/get-all-product-response.dto";
import { IFileUploader } from "src/common/application/file-uploader/file-uploader.interface";
import { ImageTransformer } from "src/common/infraestructure/image-helper/image-transformer";
import { CloudinaryFileUploader } from "src/common/infraestructure/cloudinary-file-uploader/cloudinary-file-uploader";
import { RabbitEventBus } from "src/common/infraestructure/rabbit-event-handler/rabbit-event-handler";
import { HttpExceptionHandler } from "src/common/infraestructure/exception-handler/http-exception-handler-code";
import { PerformanceDecorator } from 'src/common/application/application-services/decorators/performance-decorator/performance-decorator';
import { DeleteProductService } from 'src/product/aplication/service/commands/delete-product.service';
import { DeleteProductServiceEntryDTO } from 'src/product/aplication/DTO/entry/delete-product-service-entry.dto';
import { testCreated } from './test-event';
import { testService } from './test-service';
import { OrmCategoryRepository } from 'src/category/infraestructure/repositories/orm-category-repository';
import { UpdateProductEntryDTO } from '../DTO/entry/product-update-entry.dto';
import { UpdateProductResponseDTO } from '../DTO/response/update-product-response.dto';
import { UpdateProductServiceEntryDTO } from 'src/product/aplication/DTO/entry/update-product-service-entry.dto';
import { UpdateProductService } from 'src/product/aplication/service/commands/update-product.service';
import { CategoriesExistenceService } from 'src/common/application/application-services/common-services/categories-existence-check.service';
import { DiscountExistenceService } from 'src/common/application/application-services/common-services/discount-existence-check.service';
import { OrmDiscountRepository } from 'src/discount/infraestructure/repositories/orm-discount.repository';
import { OrmDiscountMapper } from 'src/discount/infraestructure/mappers/discount.mapper';
import { ProductParamsEntryDTO } from '../DTO/entry/product-params-entry.dto';
import { JwtAuthGuard } from 'src/auth/infraestructure/jwt/decorator/jwt-auth.guard';
import { GetAllCategoriesResponseDTO } from '../../../category/infraestructure/DTO/response/get-all-categories-response.dto';
import { OrmAuditingRepository } from 'src/common/infraestructure/auditing/repositories/orm-auditing-repository';
import { OrmAccountRepository } from 'src/user/infraestructure/repositories/orm-repositories/orm-account-repository';
import { SecurityDecorator } from 'src/common/application/application-services/decorators/security-decorator/security-decorator';
import { AuditingDecorator } from 'src/common/application/application-services/decorators/auditing-decorator/auditing.decorator';
import { IDiscountRepository } from 'src/discount/domain/repositories/discount.repository.interface';
import { FirebaseNotifier } from 'src/notification/infraestructure/notifier/firebase-notifier';
import { NotifyProductDiscountService } from 'src/notification/infraestructure/services/notification-services/notify-product-discount.service';
import { ProductDiscountModified } from 'src/product/domain/domain-event/product-discount-modified';
import { INotificationAddressRepository } from 'src/notification/infraestructure/interface/notification-address-repository.interface';
import { INotificationAlertRepository } from 'src/notification/infraestructure/interface/notification-alert-repository.interface';
import { OrmNotificationAddressRepository } from 'src/notification/infraestructure/repositories/orm-notification-address-repository';
import { OrmNotificationAlertRepository } from 'src/notification/infraestructure/repositories/orm-notification-alert-repository';
import { NotifyProductDiscountServiceEntryDTO } from 'src/notification/infraestructure/services/dto/entry/notify-product-discount-service-entry.dto';

@ApiTags("Product")
@Controller("product")
export class ProductController {

    private readonly productRepository: OrmProductRepository
    private readonly historicoRepository: HistoricoPrecioRepository
    private readonly monedaRepository: MonedaRepository
    private readonly categoryRepository: OrmCategoryRepository
    private readonly logger: Logger = new Logger('ProductController')
    private readonly idGenerator: IdGenerator<string>
    private readonly fileUploader: IFileUploader
    private readonly imageTransformer: ImageTransformer
    private readonly eventBus = RabbitEventBus.getInstance();
    private readonly categoryMapper: OrmCategoryMapper
    private readonly auditingRepository: OrmAuditingRepository;
    private readonly accountUserRepository: OrmAccountRepository;
    private readonly discountRepo: IDiscountRepository
    private readonly notiAddressRepository: INotificationAddressRepository
    private readonly notiAlertRepository: INotificationAlertRepository


    constructor(
        @Inject('DataSource') private readonly dataSource: DataSource,
        private readonly categoriesExistenceService: CategoriesExistenceService,
        private readonly discountExistenceService: DiscountExistenceService
    ) {
        this.notiAddressRepository = new OrmNotificationAddressRepository(dataSource)
        this.notiAlertRepository = new OrmNotificationAlertRepository(dataSource)
        this.discountRepo = new OrmDiscountRepository(new OrmDiscountMapper(), this.dataSource)
        this.categoryRepository = new OrmCategoryRepository(new OrmCategoryMapper(), dataSource)
        this.historicoRepository = new HistoricoPrecioRepository(dataSource)
        this.productRepository =
            new OrmProductRepository(
                new ProductMapper(
                    new OrmCategoryMapper(),
                    this.categoryRepository,
                ), dataSource
            )
        this.idGenerator = new UuidGenerator();
        this.auditingRepository = new OrmAuditingRepository(dataSource)  
        this.accountUserRepository = new OrmAccountRepository(dataSource) 
        this.monedaRepository = new MonedaRepository(dataSource)
        this.imageTransformer = new ImageTransformer();
        this.fileUploader = new CloudinaryFileUploader(),
            this.categoryMapper = new OrmCategoryMapper(),
            this.categoriesExistenceService = new CategoriesExistenceService(new OrmCategoryRepository(new OrmCategoryMapper(), this.dataSource))
        this.discountExistenceService = new DiscountExistenceService(this.discountRepo)
    }

    @Post('create')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOkResponse({
        description: 'Crea un nuevo producto en la base de datos',
        type: CreateProductEntryDTO,
    })
    async createProduct(
        @GetUser() user,
        @Body() entry: CreateProductEntryDTO
    ): Promise<string> {

        const data: CreateProductServiceEntryDTO = {
            userId: user.id,
            ...entry
        }

        const allowedRoles = ['ADMIN']
        
        const service = new ExceptionDecorator(
            new AuditingDecorator(
                new SecurityDecorator(
                    new LoggingDecorator(
                        new PerformanceDecorator(
                            new CreateProductService(
                                this.productRepository,
                                new OrmCategoryRepository(new OrmCategoryMapper, this.dataSource),
                                this.fileUploader,
                                this.idGenerator,
                                this.eventBus,
                                this.categoriesExistenceService,
                                this.discountExistenceService
                            ),
                            new NativeLogger(this.logger)
                        ),
                        new NativeLogger(this.logger)
                    )
                    ,
                    this.accountUserRepository,
                    allowedRoles
                
                    )
                    ,
                    this.auditingRepository,
                    this.idGenerator
                    )
                        
                ,
                    new HttpExceptionHandler()
                )

        const result = await service.execute(data)

        if (!result.isSuccess())
            throw new BadRequestException("Producto no creado");

        // const service_infra =
        //     new CreateHistoricoPrecioService(
        //         this.historicoRepository, this.monedaRepository, this.productRepository, this.idGenerator
        //     )

        // const result_infra = await service_infra.execute({
        //     userId: "24117a35-07b0-4890-a70f-a082c948b3d4",
        //     id_producto: result.Value.id_producto,
        //     precio: result.Value.precio,
        //     moneda: result.Value.moneda,
        // })

        // if (!result_infra.isSuccess())
        //     throw new BadRequestException("Historico no creado");

        return "Producto creado"
    }

    @Get('one/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOkResponse({
        description: 'Devuelve la informacion de un producto dado el id',
        type: GetProductResponseDTO,
    })
    async getProduct(
        @GetUser() user,
        @Param('id', ParseUUIDPipe) id: string
    ) {
        const entry: GetProductByIdServiceEntryDTO = {
            userId: user.id,
            id_product: id
        }

        const allowedRoles = ['ADMIN','CLIENT'];
                  
        const service = new ExceptionDecorator(
            new AuditingDecorator(
                new SecurityDecorator(
                        new LoggingDecorator(
                                new PerformanceDecorator(
                                    new GetProductByIdService(this.productRepository),
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

        const result = await service.execute(entry)

        if (!result.isSuccess)
            throw result.Error

        const response: GetProductResponseDTO = { ...result.Value }

        return response
    }

    @Get('many')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOkResponse({
        description: 'Devuelve la informacion de todos los productos',
        type: GetAllProductsResponseDTO,
        isArray: true
    })
    async getAllProduct(
        @GetUser() user,
        @Query() paginacion: PaginationDto,
        @Query() queryEntryParams: ProductParamsEntryDTO,
    ) {

        const allowedRoles = ['ADMIN','CLIENT'];
                  
        const service = new ExceptionDecorator(
            new AuditingDecorator(
                new SecurityDecorator(
                    new LoggingDecorator(
                        new PerformanceDecorator(
                            new GetAllProductService(this.productRepository),
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
        const data: GetAllProductServiceEntryDTO = {
            userId: user.id,
            ...paginacion,
            ...queryEntryParams
        }

        const result = await service.execute(data)

        if (!result.isSuccess())
            return result.Error

        const response: GetAllProductsResponseDTO[] = result.Value.map((product) => ({
            id: product.id,
            name: product.name,
            price: product.price,//
            currency: product.currency,//
            stock: product.stock,//
            measurement: product.measurement,//
            weight: product.weight,//
            description: product.description,//
            images: product.images, //
            caducityDate: product.caducityDate,//
            categories: product.category,//
            discount: product.discount,//
            image3d: product.image3d
          }));

        return response
    }

    @Get('one/by/name')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOkResponse({
        description: 'Devuelve la informacion de un producto dado el nombre',
        type: GetProductByNameResponseDTO,
    })
    async getProductByName(
        @GetUser() user,
        @Query('name') name: string
    ) {
        console.log(name)
        const data: GetProductByNameServiceEntryDTO = {
            userId: "24117a35-07b0-4890-a70f-a082c948b3d4",
            name: name
        }

        const service =
            new LoggingDecorator(
                new GetProductByNameService(this.productRepository),
                new NativeLogger(this.logger)
            )

        const result = await service.execute(data)

        const response: GetProductByNameResponseDTO = { ...result.Value }

        return response
    }

    @Delete('delete/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOkResponse({
        description: 'Eliminacion de un producto',
    })
    async deleteProduct(
        @GetUser() user,
        @Param('id', ParseUUIDPipe) id: string
    ) {

        const data: DeleteProductServiceEntryDTO = {
            userId: user.id,
            id_product: id
        }


        const allowedRoles = ['ADMIN'];
          
        const service = new ExceptionDecorator(
            new AuditingDecorator(
                new SecurityDecorator(
                    new LoggingDecorator(
                        new PerformanceDecorator(
                        new DeleteProductService(
                            this.productRepository
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

        await service.execute(data)

    }

    @Patch('update')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOkResponse({
        description: 'Actualiza la imformacion de un producto',
        type: UpdateProductResponseDTO,
    })
    async updateProudct(
        @GetUser() user,
        @Body() request: UpdateProductEntryDTO
    ) {

        const data: UpdateProductServiceEntryDTO = {
            userId: user.id,
            ...request
        }

        await this.eventBus.subscribe('ProductDiscountModified', async (event: ProductDiscountModified) => { 
            const service = new NotifyProductDiscountService(  
                this.notiAddressRepository,
                this.notiAlertRepository,
                this.productRepository,  
                this.idGenerator,
                FirebaseNotifier.getInstance(),
                this.discountRepo
            )
            const entry: NotifyProductDiscountServiceEntryDTO = {  
              userId: user.id,
              product_id: event.id  
            }
            const response = await service.execute(entry)
            console.log("Resultado servicio: ", response.isSuccess())
        }, 'Notificar via push por producto descuento modificado');  
          
  

        console.log("request: ", request)


        const allowedRoles = ['ADMIN'];
          
        const service = new ExceptionDecorator(
            new AuditingDecorator(
                new SecurityDecorator(
                    new LoggingDecorator(
                        new PerformanceDecorator(
                            new UpdateProductService(
                            this.productRepository
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

        const resuslt = await service.execute(data)

        const response: UpdateProductResponseDTO = { ...resuslt.Value }

        return response

    }

    @Get("rabbit")
    async testRabbit(
    ) {

        await this.eventBus.subscribe('testCreated', async (event: testCreated) => {
            console.log("evento reaccion: ", event)
        }, 'Primera reaccion')

        await this.eventBus.subscribe('testCreated', async (event: testCreated) => {
            console.log("evento reaccion 2: ", event)
        }, 'Segunda reaccion')

        console.log("hola")

        const service = new testService(this.eventBus)
        const result = await service.execute("Mensaje enviado")

    }

    @Get("image")
    async getImage(
        @Body('base64Image') base64Image: string
    ) {
        const URL = await this.fileUploader.UploadFile(base64Image)

        return URL
    }
}