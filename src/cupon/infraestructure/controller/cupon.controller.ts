import { Body, Controller, Delete, Get, Inject, Logger, Param, ParseUUIDPipe, Post, Query, UseGuards } from "@nestjs/common"
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiTags } from "@nestjs/swagger"
import { CuponRepository } from "../repositories/cupon-repository"
import { IdGenerator } from "src/common/application/id-generator/id-generator.interface"
import { DataSource } from "typeorm"
import { CuponMapper } from "../mappers/cupon-mapper"
import { UuidGenerator } from "src/common/infraestructure/id-generator/uuid-generator"

import { CreateCuponServiceEntryDto } from "src/cupon/application/DTO/entry/create-cupon-service-entry.dto"
import { ExceptionDecorator } from "src/common/application/application-services/decorators/exception-decorator/exception.decorator"
import { LoggingDecorator } from "src/common/application/application-services/decorators/logging-decorator/logging.decorator"
import { HttpExceptionHandler } from "src/common/infraestructure/exception-handler/http-exception-handler-code"
import { PerformanceDecorator } from "src/common/application/application-services/decorators/performance-decorator/performance-decorator"
import { NativeLogger } from "src/common/infraestructure/logger/logger"
import { CreateCuponService } from "src/cupon/application/command/create-cupon.service"
import { CreateCuponEntryDto } from "./DTO/entry/create-cupon-entry.dto"
import { CreateCuponResponseDto } from "./DTO/response/create-cupon-response.dto"
import { GetAllCouponsResponseDTO } from "./DTO/response/get-all-cupon-response.dto"
import { PaginationDto } from "src/common/infraestructure/dto/entry/pagination.dto"
import { GetAllCouponService } from "src/cupon/application/service/queries/get-all-cupon.service"
import { ICuponRepository } from "src/cupon/domain/repositories/cupon-repository.interface"
import { GetAllCuponServiceEntryDTO } from "src/cupon/application/DTO/entry/get-all-cupon-service-entry.dto"
import { GetCouponByCodeResponseDTO } from "./DTO/response/get-coupon-by-code-response.dto"
import { GetCouponByCodeServiceEntryDTO } from "src/cupon/application/DTO/entry/get-coupon-by-code-service-entry.dto"
import { GetCouponByCodeService } from "src/cupon/application/service/queries/get-coupon-by-code.service"
import { DeleteCouponResponseDto } from "./DTO/response/delete-cupon-response.dto"
import { DeleteCouponEntryDto } from "./DTO/entry/delete-coupon-entry.dto"
import { DeleteCuponServiceEntryDto } from "src/cupon/application/DTO/entry/delete-cupon-service-entry.dto"
import { DeleteCouponApplicationService } from "src/cupon/application/command/delete-cupon.service"
import { JwtAuthGuard } from "src/auth/infraestructure/jwt/decorator/jwt-auth.guard"
import { GetUser } from "src/auth/infraestructure/jwt/decorator/get-user.param.decorator"
import { GetCuponByUserServiceEntryDTO } from "src/cupon/application/DTO/entry/get-cupon-by-user-service-entry.dto"

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

        if (!result.isSuccess())
            return result.Error

        const response: GetAllCouponsResponseDTO[] = result.Value.map((cupon: any) => ({
            ...cupon,
            amount: cupon.amount.toString()
        }));

        return response
    }

    @Get('many/by/user')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOkResponse({
        description: 'Devuelve la informacion de todos los cupones de un usuario',
        type: GetAllCouponsResponseDTO,
    })
    async getAllCouponUser(
        @GetUser() user
    ) {
        const service =
            new ExceptionDecorator(
                new PerformanceDecorator(
                    new LoggingDecorator(
                        new GetAllCouponService(this.cuponRepository),
                        new NativeLogger(this.logger)
                    ),
                    new NativeLogger(this.logger)
                ),
                new HttpExceptionHandler()
            )


        const data: GetCuponByUserServiceEntryDTO = {
            userId: user.id
        }

        const result = await service.execute(data)

        if (!result.isSuccess())
            return result.Error

        const response: GetAllCouponsResponseDTO[] = result.Value.map((cupon) => ({
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
        if (!result.isSuccess)
            throw result.Error
        const response: GetCouponByCodeResponseDTO = { ...result.Value }

        console.log("Response" + result)
        return response
    }


    @ApiOkResponse({
        description: 'Elimina un cupón por su ID',
        type: DeleteCouponResponseDto,
    })
    @Delete('/delete/:id')
    async deleteCupon(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<DeleteCouponResponseDto> {
        const infraEntryDto: DeleteCouponEntryDto = { cuponId: id };
        //const eventBus = EventBus.getInstance()

        const serviceEntryDto: DeleteCuponServiceEntryDto = {
            userId: "24117a35-07b0-4890-a70f-a082c948b3d4",
            cuponId: infraEntryDto.cuponId
        };

        const service = new LoggingDecorator(
            new DeleteCouponApplicationService(this.cuponRepository),
            new NativeLogger(this.logger)
        );

        const result = await service.execute(serviceEntryDto);

        if (!result.isSuccess()) {
            this.logger.error(`Error eliminando cupón: ${result.Error.message}`);
            throw result.Error;
        }

        // Paso 4: Transformar la respuesta del servicio en un DTO de infraestructura
        const infraResponseDto: DeleteCouponResponseDto = {
            deletedId: result.Value.cuponId,
            message: 'Categoría eliminada exitosamente.',
        };

        // Paso 5: Retornar el DTO de infraestructura
        return infraResponseDto;
    }
}