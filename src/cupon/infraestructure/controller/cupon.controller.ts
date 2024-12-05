import { Body, Controller, Get, Inject, Logger, Param, Post, Query } from "@nestjs/common"
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
import { CreateCuponEntryDto } from "./dto/entry/create-cupon-entry.dto"
import { CreateCuponResponseDto } from "./dto/response/create-cupon-response.dto"
import { GetAllCouponsResponseDTO } from "./dto/response/get-all-cupon-response.dto"
import { PaginationDto } from "src/common/infraestructure/dto/entry/pagination.dto"
import { GetAllCouponService } from "src/cupon/application/service/queries/get-all-cupon.service"
import { ICuponRepository } from "src/cupon/domain/repositories/cupon-repository.interface"
import { GetAllCuponServiceEntryDTO } from "src/cupon/application/dto/entry/get-all-cupon-service-entry.dto"
import { GetCouponByCodeResponseDTO } from "./dto/response/get-coupon-by-code-response.dto"
import { GetCouponByCodeServiceEntryDTO } from "src/cupon/application/dto/entry/get-coupon-by-code-service-entry.dto"
import { GetCouponByCodeService } from "src/cupon/application/service/queries/get-coupon-by-code.service"

@ApiTags("Cupon")
@Controller('cupon')
export class CuponController {

    private readonly cuponRepository: CuponRepository

    private readonly logger: Logger = new Logger('CuponController')
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
                            this.cuponRepository,
                            this.idGenerator,
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

    
    @Get('many')
    @ApiOkResponse({
        description: 'Devuelve la informacion de todos los cupones',
        type: GetAllCouponsResponseDTO,
    })
    async getAllCoupon(
        @Query() paginacion: PaginationDto
    ) {
        const service =
        new LoggingDecorator(
            new GetAllCouponService(this.cuponRepository),
            new NativeLogger(this.logger)
        )

        const data: GetAllCuponServiceEntryDTO = {
            userId: "24117a35-07b0-4890-a70f-a082c948b3d4",
            ...paginacion
        }

        const result = await service.execute(data)

        if(!result.isSuccess())
            return result.Error

        const response: GetAllCouponsResponseDTO[] = result.Value.map((cupon: any) => ({
            ...cupon,
            amount: cupon.amount.toString()
        }));

        return response
    }

    @Get('one/by/code')
    @ApiOkResponse({
        description: 'Devuelve la informacion de un Cupón dado el código',
        type: GetCouponByCodeResponseDTO,
    })
    async getCuponByCode(
        @Query('code') code: string
    ) {
        const data: GetCouponByCodeServiceEntryDTO = {
            userId: "24117a35-07b0-4890-a70f-a082c948b3d4",
            cuponCode: code
        }
        console.log("Code" + code)
        const service = 
        new LoggingDecorator(
            new GetCouponByCodeService(this.cuponRepository),
            new NativeLogger(this.logger)
        )

        const result = await service.execute(data)
        if(!result.isSuccess)
            throw result.Error
        const response: GetCouponByCodeResponseDTO = {...result.Value}
        
        console.log("Response" + result)
        return response
    }

}