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
import { isNumber } from "class-validator"
import { OrmAuditingRepository } from "src/common/infraestructure/auditing/repositories/orm-auditing-repository"
import { OrmAccountRepository } from "src/user/infraestructure/repositories/orm-repositories/orm-account-repository"
import { SecurityDecorator } from "src/common/application/application-services/decorators/security-decorator/security-decorator"
import { AuditingDecorator } from "src/common/application/auditing/auditing.decorator"

@ApiTags("Cupon")
@Controller('cupon')
export class CuponController {

    private readonly cuponRepository: CuponRepository

    private readonly logger: Logger = new Logger('CuponController')
    private readonly idGenerator: IdGenerator<string>
    private readonly auditingRepository: OrmAuditingRepository;
    private readonly accountUserRepository: OrmAccountRepository;

    constructor(
        @Inject('DataSource') private readonly dataSource: DataSource//iny. dependencias
    ) {
        this.cuponRepository = new CuponRepository(new CuponMapper(), dataSource)
        this.idGenerator = new UuidGenerator();
        this.auditingRepository = new OrmAuditingRepository(dataSource)  
        this.accountUserRepository = new OrmAccountRepository(dataSource)
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth() 
    @Post("create")
    @ApiOkResponse({
        description: 'Devuelve el id del cupon creado',
        type: CreateCuponResponseDto,
    })
    async createCupon(
        @Body() request: CreateCuponEntryDto, @GetUser() user
    ) {

        const data: CreateCuponServiceEntryDto = {
            userId: user.id,
            code: request.code,
            expiration_date: request.expiration_date,
            amount: request.amount
        }


        const allowedRoles = ['ADMIN']

        const service = new ExceptionDecorator(
        new AuditingDecorator(
            new SecurityDecorator(
            new LoggingDecorator(
                new PerformanceDecorator(
                    new CreateCuponService(
                        this.cuponRepository,
                        this.idGenerator,
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
        const response: CreateCuponResponseDto = {
            cuponId: result.Value.cuponid
        }

        return response
    }


    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get('many')
    @ApiOkResponse({
        description: 'Devuelve la informacion de todos los cupones',
        type: GetAllCouponsResponseDTO,
    })
    async getAllCoupon(
        @Query() paginacion: PaginationDto, @GetUser() user
    ) {

        const allowedRoles = ['ADMIN','CLIENT'];
          
        const service = new ExceptionDecorator(
            new AuditingDecorator(
                new SecurityDecorator(
                    new LoggingDecorator(
                        new PerformanceDecorator(
                            new GetAllCouponService(this.cuponRepository),
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

        const data: GetAllCuponServiceEntryDTO = {
            userId: user.id,
            ...paginacion
        }

        const result = await service.execute(data)

        if (!result.isSuccess())
            return result.Error

        const response: GetAllCouponsResponseDTO[] = result.Value.map((cupon: any) => ({
            ...cupon,
            amount: cupon.amount
        }));

        return response
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get('many/by/user')
    @ApiOkResponse({
        description: 'Devuelve la informacion de todos los cupones de un usuario',
        type: GetAllCouponsResponseDTO,
    })
    async getAllCouponUser(
        @GetUser() user
    ) {

        const allowedRoles = ['ADMIN','CLIENT'];
          
        const service = new ExceptionDecorator(
            new AuditingDecorator(
                new SecurityDecorator(
                    new LoggingDecorator(
                        new PerformanceDecorator(
                            new GetAllCouponService(this.cuponRepository),
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





        const data: GetCuponByUserServiceEntryDTO = {
            userId: user.id
        }

        const result = await service.execute(data)

        if (!result.isSuccess())
            return result.Error

        const response: GetAllCouponsResponseDTO[] = result.Value.map((cupon) => ({
                id_cupon: cupon.id_cupon,
            
                code: cupon.code,
            
                expiration_date: cupon.expiration_date,
            
                amount: cupon.amount
            
        }));

        return response
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get('one/by/code')
    @ApiOkResponse({
        description: 'Devuelve la informacion de un Cupón dado el código',
        type: GetCouponByCodeResponseDTO,
    })
    async getCuponByCode(
        @Query('code') code: string, @GetUser() user
    ) {
        const data: GetCouponByCodeServiceEntryDTO = {
            userId: user.id,
            cuponCode: code
        }
        console.log("Code" + code)

            const allowedRoles = ['ADMIN','CLIENT'];
          
            const service = new ExceptionDecorator(
                new AuditingDecorator(
                    new SecurityDecorator(
                        new LoggingDecorator(
                            new PerformanceDecorator(
                              new GetCouponByCodeService(this.cuponRepository),
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
        if (!result.isSuccess)
            throw result.Error
        const response: GetCouponByCodeResponseDTO = { ...result.Value }

        console.log("Response" + result)
        return response
    }


    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOkResponse({
        description: 'Elimina un cupón por su ID',
        type: DeleteCouponResponseDto,
    })
    @Delete('/delete/:id')
    async deleteCupon(
        @Param('id', ParseUUIDPipe) id: string, @GetUser() user
    ): Promise<DeleteCouponResponseDto> {
        const infraEntryDto: DeleteCouponEntryDto = { cuponId: id };
        //const eventBus = EventBus.getInstance()

        const serviceEntryDto: DeleteCuponServiceEntryDto = {
            userId: user.id,
            cuponId: infraEntryDto.cuponId
        };


        const allowedRoles = ['ADMIN'];
          
        const service = new ExceptionDecorator(
            new AuditingDecorator(
                new SecurityDecorator(
                    new LoggingDecorator(
                        new PerformanceDecorator(
                            new DeleteCouponApplicationService(this.cuponRepository),
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