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
  Delete
} from '@nestjs/common';
import { GetCategoryByIdServiceEntryDTO } from 'src/category/application/dto/entry/get-category-by-id-service-entry';
//import { GetCategoryByIdServiceResponseDTO } from 'src/category/application/dto/response/get-category-by-id-service-response.dto';
//import { Result } from 'src/common/domain/result-handler/Result';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
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
import { DeleteCategoryInfraResponseDto } from '../DTO/response/delete-category-infra-response.dto';
import { DeleteCategoryApplicationService } from 'src/category/application/commands/delete-category.service';
import { CategoryParamsEntryDTO } from '../DTO/entry/category-params-entry.dto';
import { ExceptionDecorator } from 'src/common/application/application-services/decorators/exception-decorator/exception.decorator';
import { HttpExceptionHandler } from 'src/common/infraestructure/exception-handler/http-exception-handler-code';
import { GetCategoryByNameEntryDTO } from '../DTO/entry/get-category-by-name-entry.dto';


@ApiTags("Category")
@Controller('category')
export class CategoryController {

  private readonly categoryRepository: OrmCategoryRepository
  private readonly logger: Logger = new Logger('CategoryController')
  private readonly idGenerator: IdGenerator<string>
  private readonly fileUploader: IFileUploader


  constructor(
    @Inject('DataSource') private readonly dataSource: DataSource//iny. dependencias
  ) {
    this.categoryRepository = new OrmCategoryRepository(new OrmCategoryMapper(), dataSource)
    this.idGenerator = new UuidGenerator();
    this.fileUploader = new CloudinaryFileUploader();
  }

  /**
   * Endpoint para obtener una categoría por ID.
   * @param id - ID de la categoría.
   * @returns - Los datos de la categoría o un error si no se encuentra.
   */
  @Get('one/:id')
  async getCategoryById(
    @Param('id', ParseUUIDPipe) id: string
  ) {
    const entry: GetCategoryByIdServiceEntryDTO = {
      userId: "24117a35-07b0-4890-a70f-a082c948b3d4",
      id: id
    }

    const service =
      new LoggingDecorator(
        new GetCategoryByIdService(this.categoryRepository),
        new NativeLogger(this.logger)
      )

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
  @Get('one/by/name')
  @ApiOkResponse({
    description: 'Devuelve la informacion de una categoría dado el nombre',
    type: GetCategoryByNameResponseDTO,
  })
  async getCategoryByName(
    @Body() entry: GetCategoryByNameEntryDTO
  ) {

    console.log(entry)
    const data: GetCategoryByNameServiceEntryDTO = {
      userId: "24117a35-07b0-4890-a70f-a082c948b3d4",
      name: entry.name
    }

    const service =
      new LoggingDecorator(
        new GetCategoryByNameService(this.categoryRepository),
        new NativeLogger(this.logger)
      )

    const result = await service.execute(data)

    const response: GetCategoryByNameResponseDTO = { ...result.Value }

    return response

  }


  /**
   * Endpoint para crear una nueva categoría.
   * @param body - Datos necesarios para crear la categoría.
   * @returns - Los datos de la categoría creada o un error en caso de fallo.
   */
  @Post('create')
  //@UseInterceptors(FileInterceptor('icon'))
  @ApiOkResponse({
    description: 'Crea una nueva categoría en la base de datos',
    type: CreateCategoryEntryDTO,
  })
  async createCategory(@Body() entry: CreateCategoryEntryDTO): Promise<string> {

    const data: CreateCategoryServiceEntryDto = { userId: "24117a35-07b0-4890-a70f-a082c948b3d4", ...entry }

    const service =
      new LoggingDecorator(
        new CreateCategoryApplicationService(this.categoryRepository, this.idGenerator, this.fileUploader),
        new NativeLogger(this.logger)
      )

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
  @Get('many')
  @ApiOkResponse({
    description: 'Devuelve la informacion de todas las categorias',
    type: GetAllCategoriesResponseDTO,
  })
  async getAllCategories(
    @Query() paginacion: PaginationDto,
    @Query() queryEntryParams: CategoryParamsEntryDTO
) {
    const service =
    new ExceptionDecorator(
    new LoggingDecorator(
        new FindAllCategoriesApplicationService(this.categoryRepository),
        new NativeLogger(this.logger)
    ),
    new HttpExceptionHandler()
  )

    const data: GetAllCategoriesServiceEntryDTO = {
        userId: "24117a35-07b0-4890-a70f-a082c948b3d4",//esto eventualmente se va
        ...paginacion,
        ...queryEntryParams
    }

    const result = await service.execute(data)

    if (!result.isSuccess())
      return result.Error

    const response: GetAllCategoriesResponseDTO[] = {
      ...result.Value,
    }

    return response
  }

  /**
   * Endpoint para actualizar una categoría por su ID.
   * @param id - ID de la categoría a actualizar.
   * @param updateEntryDTO - Datos a actualizar en la categoría.
   * @returns - Mensaje de éxito o error si no se puede actualizar.
   */
  @Patch('/update/:id')
  @ApiOkResponse({
    description: 'Actualiza todas o algunas de las propiedades de la categoría dado su ID',
    type: UpdateCategoryEntryDTO,
  })
  async updateCategory(
    @Param('id', ParseUUIDPipe) id: string, // Validación de ID como UUID
    @Body() updateEntryDTO: UpdateCategoryEntryDTO // DTO para recibir datos
  ): Promise<string> {
    let image = null; // Obtener la imagen base64 si está presente
    const eventBus = EventBus.getInstance()

    // Si se incluye una imagen, subirla y obtener la URL
    if (updateEntryDTO.icon) {
      try {
        image = await this.fileUploader.UploadFile(updateEntryDTO.icon); // Subir la imagen
      } catch (error) {
        this.logger.error(`Error subiendo la imagen: ${error.message}`);
        throw new BadRequestException('Error al subir la imagen.');//
      }
    }

    console.log("Valor de image=", image)

    //suscripcion de los observers del evento de dominio que pudieran escuchar (al que pudieran reaccionar)

    //nombre es una propiedad a modificarse:
    // if(updateEntryDTO.name){
    //   eventBus.subscribe('CategoryNameModified',async(event: CategoryNameModified)=>{
    //     await this.
    //   })
    // }

    // Crear la entrada para el servicio de aplicación
    const data = {
      userId: "24117a35-07b0-4890-a70f-a082c948b3d4", // Usuario genérico, reemplazar según sea necesario
      id: id, // ID de la categoría
      name: updateEntryDTO.name, // Nombre (opcional)
      icon: image // URL de la imagen subida (opcional)
    };

    console.log("Valor de data=", data)

    // Instanciar el servicio de aplicación con el repositorio y event handler
    const service = new LoggingDecorator(
      new UpdateCategoryApplicationService(this.categoryRepository, eventBus),
      new NativeLogger(this.logger)
    );

    // Ejecutar el servicio de aplicación
    const result = await service.execute(data);

    // Manejar los resultados del servicio
    if (!result.isSuccess()) {
      this.logger.error(`Error actualizando categoría: ${result.Error.message}`);
      throw result.Error;
    }

    // Mensaje de éxito
    return "Categoría actualizada correctamente";
  }

  @ApiOkResponse({
    description: 'Elimina una categoría por su ID',
    type: DeleteCategoryInfraResponseDto,
  })
  @Delete('/delete/:id')
  async deleteCategory(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<DeleteCategoryInfraResponseDto> {
    // Paso 1: Crear el DTO de infraestructura de entrada
    const infraEntryDto: DeleteCategoryInfraEntryDto = { categoryId: id };
    const eventBus = EventBus.getInstance()

    // Paso 2: Transformar a un DTO de entrada de aplicación
    const serviceEntryDto: DeleteCategoryServiceEntryDto = {
      id: infraEntryDto.categoryId,
      userId: "24117a35-07b0-4890-a70f-a082c948b3d4"
    };

    const service = new LoggingDecorator(
      new DeleteCategoryApplicationService(this.categoryRepository, eventBus),
      new NativeLogger(this.logger)
    );

    // Paso 3: Ejecutar el servicio de aplicación
    const result = await service.execute(serviceEntryDto);

    if (!result.isSuccess()) {
      // Manejar el error en caso de fallo
      this.logger.error(`Error eliminando categoría: ${result.Error.message}`);
      throw result.Error;
    }

    // Paso 4: Transformar la respuesta del servicio en un DTO de infraestructura
    const infraResponseDto: DeleteCategoryInfraResponseDto = {
      deletedId: result.Value.deletedCategoryId,
      message: 'Categoría eliminada exitosamente.',
    };

    // Paso 5: Retornar el DTO de infraestructura
    return infraResponseDto;
  }

}
