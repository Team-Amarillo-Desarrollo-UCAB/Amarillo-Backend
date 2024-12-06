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
    Query
} from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { DataSource } from "typeorm";

import { GetProductResponseDTO } from "src/product/infraestructure/dto/response/get-product-response.dto";
import { OrmProductRepository } from "../repositories/product-repository";
import { ProductMapper } from "../mappers/product-mapper";
import { LoggingDecorator } from "src/common/application/application-services/decorators/logging-decorator/logging.decorator";
import { GetProductByIdService } from "src/product/aplication/service/queries/get-product-by-id.service";
import { NativeLogger } from "src/common/infraestructure/logger/logger";
import { GetProductByIdServiceEntryDTO } from "src/product/aplication/dto/entry/get-product-by-id-service-entry.dto";
import { GetUser } from "src/auth/infraestructure/jwt/decorator/get-user.param.decorator";
import { GetProductByNameServiceEntryDTO } from "src/product/aplication/dto/entry/get-product-by-name-service-entry.dto";
import { GetProductByNameService } from "src/product/aplication/service/queries/get-product-by-name.service";
import { GetProductByNameResponseDTO } from "../dto/response/get-product-by-name-response.dto";
import { CreateProductEntryDTO } from "../dto/entry/create-product-entry.dto";
import { CreateProductServiceEntryDTO } from "src/product/aplication/dto/entry/create-product-service-entry.dto";
import { CreateProductService } from "src/product/aplication/service/commands/create-product.service";
import { IdGenerator } from "src/common/application/id-generator/id-generator.interface";
import { UuidGenerator } from "src/common/infraestructure/id-generator/uuid-generator";
import { IProductRepository } from "src/product/domain/repositories/product-repository.interface";
import { HistoricoPrecioRepository } from "../repositories/historico-precio.repository";
import { CreateHistoricoPrecioService } from "../services/command/create-historico-precio.service";
import { MonedaRepository } from "../repositories/moneda.repository";
import { GetAllProductService } from "src/product/aplication/service/queries/get-all-product.service";
import { PaginationDto } from "src/common/infraestructure/dto/entry/pagination.dto";
import { GetAllProductServiceEntryDTO } from "src/product/aplication/dto/entry/get-all-product-service-entry.dto";
import { GetAllProductsResponseDTO } from "../dto/response/get-all-product-response.dto";
import { IFileUploader } from "src/common/application/file-uploader/file-uploader.interface";
import { ImageTransformer } from "src/common/infraestructure/image-helper/image-transformer";
import { CloudinaryFileUploader } from "src/common/infraestructure/cloudinary-file-uploader/cloudinary-file-uploader";
import { RabbitEventBus } from "src/common/infraestructure/rabbit-event-handler/rabbit-event-handler";
import { HttpExceptionHandler } from "src/common/infraestructure/exception-handler/http-exception-handler-code";
import { PerformanceDecorator } from 'src/common/application/application-services/decorators/performance-decorator/performance-decorator';
import { DeleteProductService } from 'src/product/aplication/service/commands/delete-product.service';
import { DeleteProductServiceEntryDTO } from 'src/product/aplication/dto/entry/delete-product-service-entry.dto';
import { testCreated } from './test-event';
import { testService } from './test-service';
import { OrmCategoryRepository } from 'src/category/infraestructure/repositories/orm-category-repository';
import { UpdateProductEntryDTO } from '../dto/entry/product-update-entry.dto';
import { UpdateProductResponseDTO } from '../dto/response/update-product-response.dto';
import { UpdateProductServiceEntryDTO } from 'src/product/aplication/dto/entry/update-product-service-entry.dto';
import { UpdateProductService } from 'src/product/aplication/service/commands/update-product.service';

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

    constructor(
        @Inject('DataSource') private readonly dataSource: DataSource
    ) {
        this.categoryRepository = new OrmCategoryRepository(new OrmCategoryMapper(), dataSource)
        this.productRepository =
            new OrmProductRepository(
                new ProductMapper(
                    new OrmCategoryMapper(),
                    this.categoryRepository,
                ), dataSource
            )
        this.idGenerator = new UuidGenerator();
        this.historicoRepository = new HistoricoPrecioRepository(dataSource)
        this.monedaRepository = new MonedaRepository(dataSource)
        this.imageTransformer = new ImageTransformer();
        this.fileUploader = new CloudinaryFileUploader()
    }

    @Post('create')
    @ApiOkResponse({
        description: 'Crea un nuevo producto en la base de datos',
        type: CreateProductEntryDTO,
    })
    async createProduct(
        @Body() entry: CreateProductEntryDTO
    ): Promise<string> {

        const data: CreateProductServiceEntryDTO = {
            userId: "24117a35-07b0-4890-a70f-a082c948b3d4",
            ...entry
        }

        const service =
            new ExceptionDecorator(
                new LoggingDecorator(
                    new CreateProductService(
                        this.productRepository,
                        new OrmCategoryRepository(new OrmCategoryMapper, this.dataSource),
                        this.fileUploader,
                        this.idGenerator,
                        this.eventBus
                    ),
                    new NativeLogger(this.logger)
                ),
                new HttpExceptionHandler()
            )

        const result = await service.execute(data)

        if (!result.isSuccess())
            throw new BadRequestException("Producto no creado");

        const service_infra =
            new CreateHistoricoPrecioService(
                this.historicoRepository, this.monedaRepository, this.productRepository, this.idGenerator
            )

        const result_infra = await service_infra.execute({
            userId: "24117a35-07b0-4890-a70f-a082c948b3d4",
            id_producto: result.Value.id_producto,
            precio: result.Value.precio,
            moneda: result.Value.moneda,
        })

        if (!result_infra.isSuccess())
            throw new BadRequestException("Historico no creado");

        return "Producto creado"
    }

    @Get('one/:id')
    @ApiOkResponse({
        description: 'Devuelve la informacion de un producto dado el id',
        type: GetProductResponseDTO,
    })
    async getProduct(
        @Param('id', ParseUUIDPipe) id: string
    ) {
        const entry: GetProductByIdServiceEntryDTO = {
            userId: "24117a35-07b0-4890-a70f-a082c948b3d4",
            id_product: id
        }

        const service =
            new ExceptionDecorator(
                new LoggingDecorator(
                    new GetProductByIdService(this.productRepository),
                    new NativeLogger(this.logger)
                ),
                new HttpExceptionHandler()
            )

        const result = await service.execute(entry)

        if (!result.isSuccess)
            throw result.Error

        const response: GetProductResponseDTO = { ...result.Value }

        return response
    }

    @Get('many')
    @ApiOkResponse({
        description: 'Devuelve la informacion de todos los productos',
        type: GetAllProductsResponseDTO,
        isArray: true
    })
    async getAllProduct(
        @Query() paginacion: PaginationDto
    ) {
        const service =
            new LoggingDecorator(
                new GetAllProductService(this.productRepository),
                new NativeLogger(this.logger)
            )

        const data: GetAllProductServiceEntryDTO = {
            userId: "24117a35-07b0-4890-a70f-a082c948b3d4",
            ...paginacion
        }

        const result = await service.execute(data)

        if (!result.isSuccess())
            return result.Error

        const response: GetAllProductsResponseDTO[] = {
            ...result.Value,
        }

        return response
    }

    @Get('one/by/name')
    @ApiOkResponse({
        description: 'Devuelve la informacion de un producto dado el nombre',
        type: GetProductByNameResponseDTO,
    })
    async getProductByName(
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
    @ApiOkResponse({
        description: 'Eliminacion de un producto',
    })
    async deleteProduct(
        @Param('id', ParseUUIDPipe) id: string
    ) {

        const data: DeleteProductServiceEntryDTO = {
            userId: "",
            id_product: id
        }

        // TODO: Agregar el decorador de seguridad
        const service =
            new ExceptionDecorator(
                new LoggingDecorator(
                    new PerformanceDecorator(
                        new DeleteProductService(
                            this.productRepository
                        ),
                        new NativeLogger(this.logger)
                    ),
                    new NativeLogger(this.logger)
                ),
                new HttpExceptionHandler()
            )

        await service.execute(data)

    }

    @Patch()
    @ApiOkResponse({
        description: 'Actualiza la imformacion de un producto',
        type: UpdateProductResponseDTO,
    })
    async updateProudct(
        @Body() request: UpdateProductEntryDTO
    ) {

        const data: UpdateProductServiceEntryDTO = {
            userId: '',
            ...request
        }

        const service =
            new ExceptionDecorator(
                new LoggingDecorator(
                    new PerformanceDecorator(
                        new UpdateProductService(
                            this.productRepository
                        ),
                        new NativeLogger(this.logger)
                    ),
                    new NativeLogger(this.logger)
                ),
                new HttpExceptionHandler()
            )

        const resuslt = await service.execute(data)

        const response: UpdateProductResponseDTO = {...resuslt.Value}

        return response

    }

    @Get("rabbit")
    async testRabbit(
    ) {

        await this.eventBus.subscribe('testCreated', async (event: testCreated) => {
            console.log("evento reaccion: ", event)
        })

        await this.eventBus.subscribe('testCreated', async (event: testCreated) => {
            console.log("evento reaccion 2: ", event)
        })

        console.log("hola")

        const service = new testService(this.eventBus)
        const result = await service.execute("Mensaje enviado")

    }
}