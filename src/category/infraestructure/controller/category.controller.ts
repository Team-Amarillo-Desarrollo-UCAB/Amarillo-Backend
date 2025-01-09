import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  Logger,
  Inject,
  BadRequestException,
  ParseUUIDPipe,
  Patch,
  Delete,
  UseGuards
} from '@nestjs/common';
import { GetCategoryByIdServiceEntryDTO } from 'src/category/application/dto/entry/get-category-by-id-service-entry';
//import { GetCategoryByIdServiceResponseDTO } from 'src/category/application/dto/response/get-category-by-id-service-response.dto';
//import { Result } from 'src/common/domain/result-handler/Result';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { OrmCategoryRepository } from '../repositories/orm-category-repository';
import { IdGenerator } from 'src/common/application/id-generator/id-generator.interface';
import { DataSource } from 'typeorm';
import { OrmCategoryMapper } from '../mappers/orm-category-mapper';
import { UuidGenerator } from 'src/common/infraestructure/id-generator/uuid-generator';
import { LoggingDecorator } from 'src/common/application/application-services/decorators/logging-decorator/logging.decorator';
import { NativeLogger } from 'src/common/infraestructure/logger/logger';
import { GetCategoryByIdService } from 'src/category/application/queries/get-category-by-id.service';
import { GetCategoryResponseDTO } from '../DTO/response/get-category-response.dto';
import { CreateCategoryEntryDTO } from '../DTO/entry/create-category-entry.dto';
import { CreateCategoryServiceEntryDto } from 'src/category/application/dto/entry/create-category-service-entry.dto';
import { CreateCategoryApplicationService } from 'src/category/application/commands/create-category.service';
import { IFileUploader } from 'src/common/application/file-uploader/file-uploader.interface';
import { GetAllCategoriesResponseDTO } from '../DTO/response/get-all-categories-response.dto';
import { PaginationDto } from 'src/common/infraestructure/dto/entry/pagination.dto';
import { FindAllCategoriesApplicationService } from 'src/category/application/queries/find-all-categories.service';
import { GetAllCategoriesServiceEntryDTO } from 'src/category/application/dto/entry/get-all-categories-service-entry.dto';
import { GetCategoryByNameServiceEntryDTO } from 'src/category/application/dto/entry/get-category-by-name-service-entry.dto';
//import { GetCategoryByNameEntryDTO } from '../dto/entry/get-category-by-name-entry.dto';
import { GetCategoryByNameResponseDTO } from '../DTO/response/get-category-by-name-response.dto';
import { GetCategoryByNameService } from 'src/category/application/queries/get-category-by-name.service';
import { CloudinaryFileUploader } from 'src/common/infraestructure/cloudinary-file-uploader/cloudinary-file-uploader';
import { UpdateCategoryEntryDTO } from '../DTO/entry/update-category-entry-infraestructure';
import { UpdateCategoryApplicationService } from 'src/category/application/commands/update-category.service';
import { EventBus } from 'src/common/infraestructure/event-bus/event-bus';
import { DeleteCategoryServiceEntryDto } from 'src/category/application/dto/entry/delete-category-service-entry.dto';
import { DeleteCategoryInfraEntryDto } from '../DTO/entry/delete-category-infra-enty.dto';
import { DeleteCategoryApplicationService } from 'src/category/application/commands/delete-category.service';
import { CategoryParamsEntryDTO } from '../DTO/entry/category-params-entry.dto';
import { ExceptionDecorator } from 'src/common/application/application-services/decorators/exception-decorator/exception.decorator';
import { HttpExceptionHandler } from 'src/common/infraestructure/exception-handler/http-exception-handler-code';
import { GetCategoryByNameEntryDTO } from '../DTO/entry/get-category-by-name-entry.dto';
import { JwtAuthGuard } from 'src/auth/infraestructure/jwt/decorator/jwt-auth.guard';
import { GetUser } from 'src/auth/infraestructure/jwt/decorator/get-user.param.decorator';
import { PerformanceDecorator } from 'src/common/application/application-services/decorators/performance-decorator/performance-decorator';
import { SecurityDecorator } from 'src/common/application/application-services/decorators/security-decorator/security-decorator';
import { AuditingDecorator } from 'src/common/application/auditing/auditing.decorator';
import { OrmAccountRepository } from 'src/user/infraestructure/repositories/orm-repositories/orm-account-repository';
import { OrmAuditingRepository } from 'src/common/infraestructure/auditing/repositories/orm-auditing-repository';
import { DeleteCategoryInfraResponseDto } from '../DTO/response/delete-category-infra-response.dto';


@ApiTags("Category")
@Controller('category')
export class CategoryController {

  private readonly categoryRepository: OrmCategoryRepository
  private readonly logger: Logger = new Logger('CategoryController')
  private readonly idGenerator: IdGenerator<string>
  private readonly fileUploader: IFileUploader
  private readonly auditingRepository: OrmAuditingRepository;
  private readonly accountUserRepository: OrmAccountRepository;


  constructor(
    @Inject('DataSource') private readonly dataSource: DataSource//iny. dependencias
  ) {
    this.categoryRepository = new OrmCategoryRepository(new OrmCategoryMapper(), dataSource)
    this.idGenerator = new UuidGenerator();
    this.fileUploader = new CloudinaryFileUploader();
    this.auditingRepository = new OrmAuditingRepository(dataSource)  
    this.accountUserRepository = new OrmAccountRepository(dataSource)
  }

  /**
   * Endpoint para obtener una categoría por ID.
   * @param id - ID de la categoría.
   * @returns - Los datos de la categoría o un error si no se encuentra.
   */
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('one/:id')
  async getCategoryById(
    @Param('id', ParseUUIDPipe) id: string, @GetUser() user
  ) {
    const entry: GetCategoryByIdServiceEntryDTO = {
      userId: user.id,
      id: id
    }

  const allowedRoles = ['ADMIN','CLIENT'];
  
    const service = new ExceptionDecorator(
        new AuditingDecorator(
            new SecurityDecorator(
                new LoggingDecorator(
                    new PerformanceDecorator(
                      new GetCategoryByIdService(this.categoryRepository),
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

    if (!result.isSuccess())
      throw result.Error

    const response: GetCategoryResponseDTO = { ...result.Value }

    return response

  }

  /**
   * Endpoint para obtener una categoría por nombre.
   * @param id - nombre de la categoría.
   * @returns - Los datos de la categoría o un error si no se encuentra.
   */
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth() 
  @Get('one/by/name')
  @ApiOkResponse({
    description: 'Devuelve la informacion de una categoría dado el nombre',
    type: GetCategoryByNameResponseDTO,
  })
  async getCategoryByName(
    @Body() entry: GetCategoryByNameEntryDTO, @GetUser() user
  ) {

    console.log(entry)
    const data: GetCategoryByNameServiceEntryDTO = {
      userId: user.id,
      name: entry.name
    }

    const allowedRoles = ['ADMIN','CLIENT'];

    const service = new ExceptionDecorator(
      new AuditingDecorator(
          new SecurityDecorator(
              new LoggingDecorator(
                  new PerformanceDecorator(
                    new GetCategoryByNameService(this.categoryRepository),
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

    const response: GetCategoryByNameResponseDTO = { ...result.Value }

    return response

  }


  /**
   * Endpoint para crear una nueva categoría.
   * @param body - Datos necesarios para crear la categoría.
   * @returns - Los datos de la categoría creada o un error en caso de fallo.
   */
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('create')
  //@UseInterceptors(FileInterceptor('icon'))
  @ApiOkResponse({
    description: 'Crea una nueva categoría en la base de datos',
    type: CreateCategoryEntryDTO,
  })
  async createCategory(@Body() entry: CreateCategoryEntryDTO, @GetUser() user): Promise<string> {

    const data: CreateCategoryServiceEntryDto = { userId: user.id, ...entry }

        const allowedRoles = ['ADMIN'];
      
        const service = new ExceptionDecorator(
            new AuditingDecorator(
                new SecurityDecorator(
                    new LoggingDecorator(
                        new PerformanceDecorator(
                          new CreateCategoryApplicationService(this.categoryRepository, this.idGenerator, this.fileUploader),
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

    if (!result.isSuccess())
      throw new BadRequestException("Categoría no creada");

    return "Categoría creada"
  }

  /**
   * Endpoint para obtener una lista paginada de categorías.
   * @param page - Página solicitada (por defecto es 1).
   * @param limit - Límite de elementos por página (por defecto es 10).
   * @returns - Lista de categorías paginada.
   */
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth() 
  @Get('many')
  @ApiOkResponse({
    description: 'Devuelve la informacion de todas las categorias',
    type: GetAllCategoriesResponseDTO,
  })
  async getAllCategories(
    @Query() paginacion: PaginationDto,
    @Query() queryEntryParams: CategoryParamsEntryDTO,
    @GetUser() user
) {


        
  const allowedRoles = ['ADMIN','CLIENT'];
    
        
  const service = new ExceptionDecorator(
            new AuditingDecorator(
                new SecurityDecorator(
                    new LoggingDecorator(
                        new PerformanceDecorator(
                            new FindAllCategoriesApplicationService(this.categoryRepository),
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
  

    const data: GetAllCategoriesServiceEntryDTO = {
        userId: user.id,
        ...paginacion,
        ...queryEntryParams
    }

    const result = await service.execute(data)

    if (!result.isSuccess())
      return result.Error

    const response: GetAllCategoriesResponseDTO[] = result.Value.map((category) => ({
      id:category.id,
      name:category.name,
      image: category.image
    }));

    return response
  }

  /**
   * Endpoint para actualizar una categoría por su ID.
   * @param id - ID de la categoría a actualizar.
   * @param updateEntryDTO - Datos a actualizar en la categoría.
   * @returns - Mensaje de éxito o error si no se puede actualizar.
   */
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()  
  @Patch('/update/:id')
  @ApiOkResponse({
    description: 'Actualiza todas o algunas de las propiedades de la categoría dado su ID',
    type: UpdateCategoryEntryDTO,
  })
  async updateCategory(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateEntryDTO: UpdateCategoryEntryDTO, @GetUser() user 
  ): Promise<string> {
    let image = null; 
    const eventBus = EventBus.getInstance()

    
    if (updateEntryDTO.image) {
      try {
        image = await this.fileUploader.UploadFile(updateEntryDTO.image); 
      } catch (error) {
        this.logger.error(`Error subiendo la imagen: ${error.message}`);
        throw new BadRequestException('Error al subir la imagen.');
      }
    }

    const data = {
      userId: user.id, 
      id: id, 
      name: updateEntryDTO.name, 
      icon: image 
    };

          const allowedRoles = ['ADMIN'];
      
          const service = new ExceptionDecorator(
              new AuditingDecorator(
                  new SecurityDecorator(
                      new LoggingDecorator(
                          new PerformanceDecorator(
                            new UpdateCategoryApplicationService(this.categoryRepository, eventBus),
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

    if (!result.isSuccess()) {
      this.logger.error(`Error actualizando categoría: ${result.Error.message}`);
      throw result.Error;
    }

    return "Categoría actualizada correctamente";
  }

  @ApiOkResponse({
    description: 'Elimina una categoría por su ID',
    type: DeleteCategoryInfraResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete('/delete/:id')
  async deleteCategory(
    @Param('id', ParseUUIDPipe) id: string, @GetUser() user
  ): Promise<DeleteCategoryInfraResponseDto> {
    const infraEntryDto: DeleteCategoryInfraEntryDto = { categoryId: id };
    const eventBus = EventBus.getInstance()

    const serviceEntryDto: DeleteCategoryServiceEntryDto = {
      id: infraEntryDto.categoryId,
      userId: user.id
    };


       const allowedRoles = ['ADMIN'];
    
        const service = new ExceptionDecorator(
            new AuditingDecorator(
                new SecurityDecorator(
                    new LoggingDecorator(
                        new PerformanceDecorator(
                          new DeleteCategoryApplicationService(this.categoryRepository, eventBus),
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


    const infraResponseDto: DeleteCategoryInfraResponseDto = {
      ...result.Value
    };

    return infraResponseDto;
  }

}
