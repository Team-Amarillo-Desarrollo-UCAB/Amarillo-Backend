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
Query
} from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { DataSource } from "typeorm";

import { GetProductResponseDTO } from "src/product/infraestructure/DTO/response/get-product-response.dto";
import { OrmProductRepository } from "../repositories/product-repository";
import { ProductMapper } from "../mappers/product-mapper";
import { LoggingDecorator } from "src/common/application/application-services/decorators/logging-decorator/logging.decorator";
import { GetProductByIdService } from "src/product/aplication/service/queries/get-product-by-id.service";
import { NativeLogger } from "src/common/infraestructure/logger/logger";
import { GetProductByIdServiceEntryDTO } from "src/product/aplication/DTO/entry/get-product-by-id-service-entry.dto";
import { GetUser } from "src/common/infraestructure/jwt/decorator/get-user.param.decorator";
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
import { GetProductByNameEntryDTO } from "../DTO/entry/get-product-by-name-entry.dto";
import { GetAllProductService } from "src/product/aplication/service/queries/get-all-product.service";
import { PaginationDto } from "src/common/infraestructure/dto/entry/pagination.dto";
import { GetAllProductServiceEntryDTO } from "src/product/aplication/DTO/entry/get-all-product-service-entry.dto";
import { GetAllProductsResponseDTO } from "../DTO/response/get-all-product-response.dto";
import { IFileUploader } from "src/common/application/file-uploader/file-uploader.interface";
import { ImageTransformer } from "src/common/infraestructure/image-helper/image-transformer";
import { CloudinaryFileUploader } from "src/common/infraestructure/cloudinary-file-uploader/cloudinary-file-uploader";
import { RabbitEventBus } from "src/common/infraestructure/rabbit-event-handler/rabbit-event-handler";
import { testCreated } from "./test-event";
import { testService } from "./test-service";

@ApiTags("Product")
@Controller("product")
export class ProductController {

    private readonly productRepository: OrmProductRepository
    private readonly historicoRepository: HistoricoPrecioRepository
    private readonly monedaRepository: MonedaRepository
    private readonly logger: Logger = new Logger('ProductController')
    private readonly idGenerator: IdGenerator<string>
    private readonly fileUploader: IFileUploader
    private readonly imageTransformer: ImageTransformer
    private readonly eventBus = RabbitEventBus.getInstance();

    constructor(
        @Inject('DataSource') private readonly dataSource: DataSource
    ) {
        this.productRepository = new OrmProductRepository(new ProductMapper(),dataSource)
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
        new LoggingDecorator(
            new CreateProductService(this.productRepository,this.idGenerator),
            new NativeLogger(this.logger)
        )

        const result = await service.execute(data)

        if(!result.isSuccess())
            throw new BadRequestException("Producto no creado");
        
        const service_infra = 
        new CreateHistoricoPrecioService(
            this.historicoRepository,this.monedaRepository,this.productRepository,this.idGenerator
        )

        const result_infra = await service_infra.execute({
            userId: "24117a35-07b0-4890-a70f-a082c948b3d4",
            id_producto: result.Value.id_producto,
            precio: result.Value.precio,
            moneda: result.Value.moneda,
        })

        if(!result_infra.isSuccess())
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
        new LoggingDecorator(
            new GetProductByIdService(this.productRepository),
            new NativeLogger(this.logger)
        )

        const result = await service.execute(entry)

        if(!result.isSuccess)
            throw result.Error

        const response: GetProductResponseDTO = {...result.Value}

        return response
    }

    @Get('many')
    @ApiOkResponse({
        description: 'Devuelve la informacion de todos los productos',
        type: GetAllProductsResponseDTO,
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

        if(!result.isSuccess())
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

        const response: GetProductByNameResponseDTO = {...result.Value}

        return response
    }

    // Endpoints para probar caracteristicas adicionales

    @Get("image")
    async getImage(
        @Body('base64Image') base64Image: string
    ){
        const URL = await this.fileUploader.UploadFile(base64Image)

        return URL
    }

    @Get("rabbit")
    async testRabbit(
    ){

        this.eventBus.subscribe( 'testCreated', async ( event: testCreated ) =>{
            console.log("evento reaccion: ",event)
        })

        console.log("hola")

        const service = new testService(this.eventBus)
        const result = await service.execute("Mensaje enviado")

    }
}