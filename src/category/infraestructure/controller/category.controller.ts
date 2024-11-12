import { Controller, Get, Post, Param, Body, Query, HttpStatus, HttpException, Logger, Inject, BadRequestException, ParseUUIDPipe } from '@nestjs/common';
import { GetCategoryByIdServiceEntryDTO } from 'src/category/application/dto/entry/get-category-by-id-service-entry';
import { GetCategoryByIdServiceResponseDTO } from 'src/category/application/dto/response/get-category-by-id-service-response.dto';
import { Result } from 'src/common/domain/result-handler/Result';
import { ApiOkResponse,ApiTags } from '@nestjs/swagger';
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
import { IFileUploader } from 'src/common/Application/file-uploader/file-uploader.interface';
import { GetAllCategoriesResponseDTO } from '../DTO/response/get-all-categories-response.dto';
import { PaginationDto } from 'src/common/infraestructure/dto/entry/pagination.dto';
import { FindAllCategoriesApplicationService } from 'src/category/application/queries/find-all-categories.service';
import { GetAllCategoriesServiceEntryDTO } from 'src/category/application/dto/entry/get-all-categories-service-entry.dto';
import { GetCategoryByNameServiceEntryDTO } from 'src/category/application/dto/entry/get-category-by-name-service-entry.dto';
//import { GetCategoryByNameEntryDTO } from '../DTO/entry/get-category-by-name-entry.dto';
import { GetCategoryByNameResponseDTO } from '../DTO/response/get-category-by-name-response.dto';
import { GetCategoryByNameService } from 'src/category/application/queries/get-category-by-name.service';
import { CloudinaryFileUploader } from 'src/common/infraestructure/cloudinary-file-uploader/cloudinary-file-uploader';
import { GetCategoryByNameEntryDTO } from '../DTO/entry/get-category-by-name-entry.dto';


@ApiTags("Category")
@Controller('category')
export class CategoryController {

  private readonly categoryRepository: OrmCategoryRepository
  private readonly logger: Logger = new Logger('CategoryController')
  private readonly idGenerator: IdGenerator<string>
  private readonly fileUploader: IFileUploader//dudoso
  
  
  constructor(
    @Inject('DataSource') private readonly dataSource: DataSource//iny. dependencias
  ) {
        this.categoryRepository = new OrmCategoryRepository(new OrmCategoryMapper(),dataSource)
        this.idGenerator = new UuidGenerator();
        this.fileUploader=new CloudinaryFileUploader();
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
        id_category: id
    }

    const service = 
    new LoggingDecorator(
        new GetCategoryByIdService(this.categoryRepository),
        new NativeLogger(this.logger)
    )

    const result = await service.execute(entry)

    if(!result.isSuccess)
        throw result.Error

    const response: GetCategoryResponseDTO = {...result.Value}

    return response

  }

  /**
   * Endpoint para obtener una categoría por nombre.
   * @param id - nombre de la categoría.
   * @returns - Los datos de la categoría o un error si no se encuentra.
   */
  @Get('one/name')
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

  const response: GetCategoryByNameResponseDTO = {...result.Value}

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

    const data: CreateCategoryServiceEntryDto = {userId: "24117a35-07b0-4890-a70f-a082c948b3d4", ...entry}

    const service = 
    new LoggingDecorator(
        new CreateCategoryApplicationService(this.categoryRepository,this.idGenerator,this.fileUploader),
        new NativeLogger(this.logger)
    )

    const result = await service.execute(data)

    if(!result.isSuccess())
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
    @Query() paginacion: PaginationDto
) {
    const service =
    new LoggingDecorator(
        new FindAllCategoriesApplicationService(this.categoryRepository),
        new NativeLogger(this.logger)
    )

    const data: GetAllCategoriesServiceEntryDTO = {
        userId: "24117a35-07b0-4890-a70f-a082c948b3d4",
        ...paginacion
    }

    const result = await service.execute(data)

    if(!result.isSuccess())
        return result.Error

    const response: GetAllCategoriesResponseDTO[] = {
        ...result.Value,
    }

    return response
  }
}
