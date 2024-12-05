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
    BadRequestException,
  } from '@nestjs/common';
  import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
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
  
  
  @ApiTags('Discount')
  @Controller('discount')
  export class DiscountController {
    private readonly discountRepository: OrmDiscountRepository;
    private readonly logger: Logger = new Logger('DiscountController');
    private readonly idGenerator: UuidGenerator;
    private readonly fileUploader: IFileUploader; 
    constructor(@Inject('DataSource') private readonly dataSource: DataSource) {
      this.discountRepository = new OrmDiscountRepository(
        new OrmDiscountMapper(),
        dataSource,
      );
      this.idGenerator = new UuidGenerator();
      this.fileUploader = new CloudinaryFileUploader()
    }
  
    /**
     * Endpoint para obtener un descuento por ID.
     * @param id - ID del descuento.
     * @returns - Datos del descuento o error si no se encuentra.
     */
    @Get('one/:id')
    async getDiscountById(@Param('id', ParseUUIDPipe) id: string) {
      
      const entry: GetDiscountByIdServiceEntryDto={
        userId: "24117a35-07b0-4890-a70f-a082c948b3d4",
        id_discount: id
      }
      const service = new LoggingDecorator(
        new GetDiscountByIdService(this.discountRepository),
        new NativeLogger(this.logger),
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
    @Post('create')
    @ApiOkResponse({
      description: 'Crea un nuevo descuento en la base de datos.',
      type: CreateDiscountEntryDTO,
    })
    async createDiscount(@Body() entry: CreateDiscountEntryDTO) {
    
        const data: CreateDiscountServiceEntryDto = {userId: "24117a35-07b0-4890-a70f-a082c948b3d4", ...entry}

        console.log("Data para crear en infraestructura:",data)
        
      const service = new LoggingDecorator(
        new CreateDiscountApplicationService(this.discountRepository, this.idGenerator, this.fileUploader),
        new NativeLogger(this.logger),
      );
  
      const result = await service.execute(data);
  
      if (!result.isSuccess())
        return result.Error
  
      return 'Descuento creado exitosamente';
    }

    @Get('many')
    @ApiOkResponse({
        description: 'Devuelve la informacion de todos los descuentos',
        type: GetAllDiscountsResponseDTO,
    })
    async getAllProduct(
        @Query() paginacion: PaginationDto
    ) {
        const service =
        new LoggingDecorator(
            new GetAllDiscountService(this.discountRepository),
            new NativeLogger(this.logger)
        )

        const data: GetAllDiscountServiceEntryDTO = {
            userId: "24117a35-07b0-4890-a70f-a082c948b3d4",
            ...paginacion
        }

        const result = await service.execute(data)

        if(!result.isSuccess())
            return result.Error

        const response: GetAllDiscountsResponseDTO[] = {
            ...result.Value,
        }

        return response
    }

  
  }
  