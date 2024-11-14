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
import { LoggingDecorator } from "src/common/application/application-services/decorators/logging-decorator/logging.decorator";
import { NativeLogger } from "src/common/infraestructure/logger/logger";
import { GetProductByIdServiceEntryDTO } from "src/product/aplication/DTO/entry/get-product-by-id-service-entry.dto";
import { CreateProductService } from "src/product/aplication/service/commands/create-product.service";
import { IdGenerator } from "src/common/application/id-generator/id-generator.interface";
import { UuidGenerator } from "src/common/infraestructure/id-generator/uuid-generator";
import { PaginationDto } from "src/common/infraestructure/dto/entry/pagination.dto";
import { IFileUploader } from "src/common/application/file-uploader/file-uploader.interface";
import { ImageTransformer } from "src/common/infraestructure/image-helper/image-transformer";
import { CloudinaryFileUploader } from "src/common/infraestructure/cloudinary-file-uploader/cloudinary-file-uploader";
import { RabbitEventBus } from "src/common/infraestructure/rabbit-event-handler/rabbit-event-handler";
import { IOrderRepository } from "src/order/domain/repositories/order-repository.interface";
import { OrderRepository } from "../repositories/order-repository";
import { IMapper } from "src/common/application/mappers/mapper.interface";
import { Order } from "src/order/domain/order";
import { OrmOrder } from "../entites/order.entity";
import { CreateOrderEntryDTO } from "../DTO/entry/create-order-entry-dto";
import { CreateOrderResponseDTO } from "../DTO/response/create-order-response";
import { CreateOrderEntryServiceDTO } from "src/order/application/DTO/entry/create-order-entry-service";
import { CreateOrderService } from "src/order/application/services/create-order.service";
import { IProductRepository } from "src/product/domain/repositories/product-repository.interface";
import { OrmProductRepository } from "src/product/infraestructure/repositories/product-repository";
import { ProductMapper } from "src/product/infraestructure/mappers/product-mapper";
import { OrderMapper } from "../mappers/order-mapper";
import { CreateDetalleService } from "../services/command/create-detalle-orden.service";
import { DetalleRepository } from "../repositories/detalle_orden.respoitory";
import { CreateDetalleServiceEntry } from "../services/DTO/entry/create-detalle-service-entry";
import { CreateEstadoOrdenService } from "../services/command/create-estado-orden.service";
import { EstadoOrdenRepository } from "../repositories/estado_orden.repository";
import { EstadoRepository } from "../repositories/estado.repository";
import { JetEmailSender } from "src/common/infraestructure/utils/sendgrid-email-sender.infraestructure";

@ApiTags("Order")
@Controller("order")
export class OrderController {

    private readonly idGenerator: IdGenerator<string>
    private readonly fileUploader: IFileUploader
    private readonly imageTransformer: ImageTransformer
    private readonly eventBus = RabbitEventBus.getInstance();
    private readonly orderRepository: IOrderRepository
    private readonly productRepository: IProductRepository
    private readonly logger: Logger = new Logger('OrderController')
    private readonly detalleRepository: DetalleRepository
    private readonly estadoOrdenRepository: EstadoOrdenRepository
    private readonly estadoRepository: EstadoRepository

    constructor(
        @Inject('DataSource') private readonly dataSource: DataSource
    ) {
        this.idGenerator = new UuidGenerator();
        this.imageTransformer = new ImageTransformer();
        this.fileUploader = new CloudinaryFileUploader()
        this.orderRepository = new OrderRepository(new OrderMapper, dataSource)
        this.productRepository = new OrmProductRepository(new ProductMapper(), dataSource)
        this.detalleRepository = new DetalleRepository(dataSource)
        this.estadoOrdenRepository = new EstadoOrdenRepository(dataSource)
        this.estadoRepository = new EstadoRepository(dataSource)
    }

    @Post('create')
    @ApiOkResponse({
        description: 'Crea una nueva orden en la base de datos',
        type: CreateOrderResponseDTO
    })
    async createOrder(
        @Body() entry: CreateOrderEntryDTO[]
    ): Promise<CreateOrderResponseDTO> {
        const data: CreateOrderEntryServiceDTO = {
            userId: "24117a35-07b0-4890-a70f-a082c948b3d4",
            entry: entry.map((entry) => ({
                ...entry,
            })),
        }

        const service =
            new LoggingDecorator(
                new CreateOrderService(
                    this.orderRepository,
                    this.productRepository,
                    this.idGenerator
                ),
                new NativeLogger(this.logger)
            )

        const result = await service.execute(data)

        if (!result.isSuccess())
            throw result.Error

        const service_create_detalle =
            new LoggingDecorator(
                new CreateDetalleService(
                    this.detalleRepository
                ),
                new NativeLogger(this.logger)
            )

        const result_create_detalle = await service_create_detalle.execute({
            userId: "24117a35-07b0-4890-a70f-a082c948b3d4",
            ...result.Value
        })

        if (!result.isSuccess())
            throw result_create_detalle.Error

        console.log("Detalle creado")

        const service_create_estado_orden =
            new LoggingDecorator(
                new CreateEstadoOrdenService(
                    this.estadoOrdenRepository,
                    this.estadoRepository,
                    this.orderRepository
                ),
                new NativeLogger(this.logger)
            )
 
        const result_create_estado_orden = await service_create_estado_orden.execute({
            userId: "24117a35-07b0-4890-a70f-a082c948b3d4",
            id_orden: result.Value.id_orden,
            fecha_inicio: result.Value.fecha_creacion,
            estado: result.Value.estado
        })

        if (!result_create_estado_orden.isSuccess())
            throw new Error("Relacion estado orden no creada")

        console.log("Estado_orden creado")

        const response: CreateOrderResponseDTO = {
            id_order: result.Value.id_orden
        }

        return response
    }

    @Get('email')
    @ApiOkResponse({
        description: 'Devuelve la informacion de una orden dado el id',
    })
    async sendEmain(
        @Body('email') email: string,
    ) {
        console.log(email)
        const sender = new JetEmailSender()
        await sender.sendEmailMailGun(email,"Luigi")

    }


}