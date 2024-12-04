import { Body, Controller, Inject, Logger, Post } from "@nestjs/common"
import { ApiBody, ApiOkResponse, ApiTags } from "@nestjs/swagger"
import { CuponRepository } from "../repositories/cupon-repository"
import { IdGenerator } from "src/common/application/id-generator/id-generator.interface"
import { DataSource } from "typeorm"
import { CuponMapper } from "../mappers/cupon-mapper"
import { UuidGenerator } from "src/common/infraestructure/id-generator/uuid-generator"
import { CreateCuponServiceEntryDto } from "src/cupon/application/dto/entry/create-cupon-service-entry.dto"
import { ExceptionDecorator } from "src/common/application/application-services/decorators/exception-decorator/exception.decorator"
import { LoggingDecorator } from "src/common/application/application-services/decorators/logging-decorator/logging.decorator"
import { HttpExceptionHandler } from "src/common/infraestructure/exception-handler/http-exception-handler-code"
import { PerformanceDecorator } from "src/common/application/application-services/decorators/performance-decorator/performance-decorator"
import { NativeLogger } from "src/common/infraestructure/logger/logger"
import { CreateCuponService } from "src/cupon/application/command/create-cupon.service"
import { CreateCuponEntryDto } from "./DTO/entry/create-cupon-entry.dto"
import { CreateCuponResponseDto } from "./DTO/response/create-cupon-response.dto"

@ApiTags("Cupon")
@Controller('cupon')
export class CuponController {

    private readonly cuponRepository: CuponRepository
    private readonly logger: Logger = new Logger('CategoryController')
    private readonly idGenerator: IdGenerator<string>

    constructor(
        @Inject('DataSource') private readonly dataSource: DataSource//iny. dependencias
    ) {
        this.cuponRepository = new CuponRepository(new CuponMapper(), dataSource)
        this.idGenerator = new UuidGenerator();
    }

    @Post("create")
    @ApiOkResponse({
        description: 'Devuelve el id del cupon creado',
        type: CreateCuponResponseDto,
    })
    async createCupon(
        @Body() request: CreateCuponEntryDto
    ) {

        const data: CreateCuponServiceEntryDto = {
            userId: "24117a35-07b0-4890-a70f-a082c948b3d4",
            code: request.code,
            expiration_date: request.expiration_date,
            amount: request.amount
        }

        const service =
            new ExceptionDecorator(
                new LoggingDecorator(
                    new PerformanceDecorator(
                        new CreateCuponService(
                            this.idGenerator,
                            this.cuponRepository
                        ),
                        new NativeLogger(this.logger)
                    ),
                    new NativeLogger(this.logger)
                ),
                new HttpExceptionHandler()
            )

        const result = await service.execute(data)

        const response: CreateCuponResponseDto = {
            cuponId: result.Value.cuponid
        }

        return response
    }

}