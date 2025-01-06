import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  Patch,
  Delete,
  Logger,
  Inject,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { DataSource } from 'typeorm';
import { UuidGenerator } from 'src/common/infraestructure/id-generator/uuid-generator';
import { LoggingDecorator } from 'src/common/application/application-services/decorators/logging-decorator/logging.decorator';
import { NativeLogger } from 'src/common/infraestructure/logger/logger';
import { OrmDiscountRepository } from '../repositories/orm-discount.repository';
import { OrmDiscountMapper } from '../mappers/discount.mapper';
import { GetDiscountByIdService } from 'src/discount/application/services/queries/get-discount-by-id.service';
import { GetDiscountResponseDTO } from '../dto/response/get-discount-response.dto';
import { CreateDiscountEntryDTO } from '../dto/entry/create-discount-entry.dto';
import { CreateDiscountApplicationService } from 'src/discount/application/services/commands/create-discount.service';
import { CreateDiscountServiceEntryDto } from 'src/discount/application/dto/entry/create-discount-service-entry.dto';
import { GetDiscountByIdServiceEntryDto } from 'src/discount/application/dto/entry/get-discount-by-id-service-entry.dto';
import { IFileUploader } from 'src/common/application/file-uploader/file-uploader.interface';
import { CloudinaryFileUploader } from 'src/common/infraestructure/cloudinary-file-uploader/cloudinary-file-uploader';
import { GetAllDiscountsResponseDTO } from '../dto/response/get-all-discounts-response.dto';
import { PaginationDto } from 'src/common/infraestructure/dto/entry/pagination.dto';
import { GetAllDiscountService } from 'src/discount/application/services/queries/get-all-discount.service';
import { GetAllDiscountServiceEntryDTO } from 'src/discount/application/dto/entry/get-all-discount-service.dto';
import { EventBus } from 'src/common/infraestructure/event-bus/event-bus';
import { ExceptionDecorator } from 'src/common/application/application-services/decorators/exception-decorator/exception.decorator';
import { PerformanceDecorator } from 'src/common/application/application-services/decorators/performance-decorator/performance-decorator';
import { SecurityDecorator } from 'src/common/application/application-services/decorators/security-decorator/security-decorator';
import { AuditingDecorator } from 'src/common/application/auditing/auditing.decorator';
import { HttpExceptionHandler } from 'src/common/infraestructure/exception-handler/http-exception-handler-code';
import { UpdateDiscountApplicationService } from 'src/discount/application/services/commands/update-discount.service';
import { GetUser } from 'src/auth/infraestructure/jwt/decorator/get-user.param.decorator';
import { OrmAuditingRepository } from 'src/common/infraestructure/auditing/repositories/orm-auditing-repository';
import { OrmAccountRepository } from 'src/user/infraestructure/repositories/orm-repositories/orm-account-repository';
import { UpdateDiscountServiceEntryDto } from 'src/discount/application/dto/entry/update-discount-service-entry.dto';
import { UpdateDiscountEntryDTO } from '../dto/entry/update-discount-entry.dto';
import { UpdateDiscountResponseDTO } from '../dto/response/update-discount-response.dto';
import { JwtAuthGuard } from 'src/auth/infraestructure/jwt/decorator/jwt-auth.guard';
import { DeleteDiscountApplicationService } from 'src/discount/application/services/commands/delete-discount.service';
import { DeleteDiscountServiceEntryDto } from 'src/discount/application/dto/entry/delete-discount-service-entry.dto';
import { DeleteDiscountResponseDTO } from '../dto/response/delete-discount-response.dto';


@ApiTags('Discount')
@Controller('discount')
export class DiscountController {
  private readonly discountRepository: OrmDiscountRepository;
  private readonly logger: Logger = new Logger('DiscountController');
  private readonly idGenerator: UuidGenerator;
  private readonly fileUploader: IFileUploader;
  private readonly auditingRepository: OrmAuditingRepository;
  private readonly accountUserRepository: OrmAccountRepository;
  constructor(@Inject('DataSource') private readonly dataSource: DataSource) {
    this.discountRepository = new OrmDiscountRepository(
      new OrmDiscountMapper(),
      dataSource,
    );
    this.idGenerator = new UuidGenerator();
    this.fileUploader = new CloudinaryFileUploader()
    this.auditingRepository = new OrmAuditingRepository(dataSource)  
    this.accountUserRepository = new OrmAccountRepository(dataSource)
  }

  /**
   * Endpoint para obtener un descuento por ID.
   * @param id - ID del descuento.
   * @returns - Datos del descuento o error si no se encuentra.
   */
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('one/:id')
  async getDiscountById(@Param('id', ParseUUIDPipe) id: string, @GetUser() user) {

    const entry: GetDiscountByIdServiceEntryDto = {
      userId: user.id,
      id_discount: id
    }


    const allowedRoles = ['ADMIN','CLIENT'];
  
    const service = new ExceptionDecorator(
        new AuditingDecorator(
            new SecurityDecorator(
                new LoggingDecorator(
                    new PerformanceDecorator(
                      new GetDiscountByIdService(this.discountRepository),
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

    const result = await service.execute(entry);

    if (!result.isSuccess()) throw result.Error;

    const response: GetDiscountResponseDTO = { ...result.Value };
    return response;
  }

  /**
   * Endpoint para crear un descuento.
   * @param entry - Datos necesarios para crear el descuento.
   * @returns - Mensaje de éxito o error.
   */
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('create')
  @ApiOkResponse({
    description: 'Crea un nuevo descuento en la base de datos.',
    type: CreateDiscountEntryDTO,
  })
  async createDiscount(@Body() entry: CreateDiscountEntryDTO, @GetUser() user) {

    const data: CreateDiscountServiceEntryDto = { userId: user.id, ...entry }

    const allowedRoles = ['ADMIN'];
  
    const service = new ExceptionDecorator(
        new AuditingDecorator(
            new SecurityDecorator(
                new LoggingDecorator(
                    new PerformanceDecorator(
                        new CreateDiscountApplicationService(this.discountRepository, this.idGenerator, this.fileUploader),
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

    const result = await service.execute(data);

    if (!result.isSuccess())
      return result.Error

    return 'Descuento creado exitosamente';
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('many')
  @ApiOkResponse({
    description: 'Devuelve la informacion de todos los descuentos',
    type: GetAllDiscountsResponseDTO,
  })
  async getAllDiscounts(
    @Query() paginacion: PaginationDto, @GetUser() user
  ) {


      const allowedRoles = ['ADMIN','CLIENT'];
  
      const service = new ExceptionDecorator(
          new AuditingDecorator(
              new SecurityDecorator(
                  new LoggingDecorator(
                      new PerformanceDecorator(
                          new GetAllDiscountService(this.discountRepository),
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

    const data: GetAllDiscountServiceEntryDTO = {
      userId: user.id,
      ...paginacion
    }

    const result = await service.execute(data)

    if (!result.isSuccess())
      return result.Error

    const response: GetAllDiscountsResponseDTO[] = {
      ...result.Value,
    }

    return response
  }
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()  
  @Patch("/update/:id")
  @ApiOkResponse({
      description: 'Actualiza la información de un descuento',
      type: UpdateDiscountResponseDTO,
  })
  async updateDiscount(
      @Param('id', ParseUUIDPipe) id: string,
      @Body() request: UpdateDiscountEntryDTO, @GetUser() user
  ) {
      const data: UpdateDiscountServiceEntryDto = {
          userId: user.id,
          id: id,
          ...request
      }
  
      const eventBus = EventBus.getInstance();
  
      const allowedRoles = ['ADMIN'];
  
      const service = new ExceptionDecorator(
          new AuditingDecorator(
              new SecurityDecorator(
                  new LoggingDecorator(
                      new PerformanceDecorator(
                          new UpdateDiscountApplicationService(
                              this.discountRepository,
                              eventBus
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
  
      const result = await service.execute(data);
  
      const response: UpdateDiscountResponseDTO = { ...result.Value };
  
      return response;
  }

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Delete('/delete/:id')
async deleteDiscount(
    @Param('id', ParseUUIDPipe) id: string, @GetUser() user
): Promise<DeleteDiscountResponseDTO> {
    const infraEntryDto: DeleteDiscountResponseDTO = { id: id };
    const eventBus = EventBus.getInstance();

    const serviceEntryDto: DeleteDiscountServiceEntryDto = {
        id: infraEntryDto.id,
        userId: user.id
    };

    const allowedRoles = ['ADMIN'];

    const service = new ExceptionDecorator(
        new AuditingDecorator(
            new SecurityDecorator(
                new LoggingDecorator(
                    new PerformanceDecorator(
                        new DeleteDiscountApplicationService(
                            this.discountRepository,
                            eventBus
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

    const result = await service.execute(serviceEntryDto);

    const infraResponseDto: DeleteDiscountResponseDTO = {
        id: id
    };
    return infraResponseDto;
}

  


}
