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
  Patch
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { DataSource } from 'typeorm';
import { CreateBundleEntryDTO } from '../dto/entry/create-bundle-entry.dto';
import { CreateBundleServiceEntryDto } from 'src/bundle/application/dto/entry/create-bundle-service-entry.dto';
import { GetBundleByIdServiceEntryDTO } from 'src/bundle/application/dto/entry/get-bundle-by-id-service-entry.dto';
import { LoggingDecorator } from 'src/common/application/application-services/decorators/logging-decorator/logging.decorator';
import { NativeLogger } from 'src/common/infraestructure/logger/logger';
import { OrmBundleRepository } from '../repositories/orm-bundle.repository';
import { BundleMapper } from '../mappers/bundle-mapper';
import { CreateBundleApplicationService } from 'src/bundle/application/services/commands/create-bundle.service';
import { GetAllBundlesResponseDTO } from '../dto/response/get-all-bundles-response.dto';
import { GetBundleByIdService } from 'src/bundle/application/services/queries/get-bundle-by-id.service';
import { PaginationDto } from 'src/common/infraestructure/dto/entry/pagination.dto';//
import { BundleParamsEntryDTO } from '../dto/entry/bundle-params-entry.dto';
import { ExceptionDecorator } from 'src/common/application/application-services/decorators/exception-decorator/exception.decorator';
import { FindAllBundlesApplicationService } from 'src/bundle/application/services/queries/find-all-bundles.service';
import { HttpExceptionHandler } from 'src/common/infraestructure/exception-handler/http-exception-handler-code';
import { GetAllBundlesServiceEntryDTO } from 'src/bundle/application/dto/entry/get-all-bundles-service-entry.dto';
import { IdGenerator } from 'src/common/application/id-generator/id-generator.interface';
import { IFileUploader } from 'src/common/application/file-uploader/file-uploader.interface';
import { UuidGenerator } from 'src/common/infraestructure/id-generator/uuid-generator';
import { CloudinaryFileUploader } from 'src/common/infraestructure/cloudinary-file-uploader/cloudinary-file-uploader';
import { BundleCurrency } from 'src/bundle/domain/enum/bundle-currency-enum';
import { Measurement } from 'src/bundle/domain/enum/measurement-enum';
import { CategoriesExistenceService } from 'src/bundle/application/services/queries/categories-existence-check.service';
import { ProductsExistenceService } from 'src/bundle/application/services/queries/product-existence-check.service';
import { OrmCategoryRepository } from 'src/category/infraestructure/repositories/orm-category-repository';
import { OrmCategoryMapper } from 'src/category/infraestructure/mappers/orm-category-mapper';
import { OrmProductRepository } from 'src/product/infraestructure/repositories/product-repository';
import { ProductMapper } from '../../../product/infraestructure/mappers/product-mapper';
import { DiscountExistenceService } from '../../application/services/queries/discount-existence-check.service';
import { OrmDiscountRepository } from '../../../discount/infraestructure/repositories/orm-discount.repository';
import { OrmDiscountMapper } from '../../../discount/infraestructure/mappers/discount.mapper';
import { UpdateBundleServiceEntryDto } from 'src/bundle/application/dto/entry/update-bundle-service-entry.dto';
import { PerformanceDecorator } from 'src/common/application/application-services/decorators/performance-decorator/performance-decorator';
import { UpdateBundleApplicationService } from 'src/bundle/application/services/commands/update-bundle.service';
import { EventBus } from '../../../common/infraestructure/event-bus/event-bus';
import { UpdateBundleEntryDTO } from '../dto/entry/update-bundle-entry.dto';
import { UpdateBundleResponseDTO } from '../dto/response/update-bundle-response.dto';


@ApiTags("Bundle")
@Controller('bundle')
export class BundleController {
  private readonly bundleRepository: OrmBundleRepository;
  private readonly logger: Logger = new Logger('BundleController');
  private readonly idGenerator: IdGenerator<string>;
  private readonly fileUploader: IFileUploader;
  private readonly categoryMapper: OrmCategoryMapper


  constructor(
    @Inject('DataSource') private readonly dataSource: DataSource,
    private readonly categoriesExistenceService: CategoriesExistenceService,
    private readonly productExistenceService: ProductsExistenceService,
    private readonly discountExistenceService: DiscountExistenceService

  ) {
    this.bundleRepository = new OrmBundleRepository(
      new BundleMapper(),
      this.dataSource//
    );
    this.idGenerator = new UuidGenerator();
    this.fileUploader = new CloudinaryFileUploader();
    this.categoriesExistenceService = new CategoriesExistenceService(new OrmCategoryRepository(new OrmCategoryMapper(), this.dataSource))
    this.categoryMapper = new OrmCategoryMapper()
    this.productExistenceService =
      new ProductsExistenceService(
        new OrmProductRepository(
          new ProductMapper(
            this.categoryMapper,
            new OrmCategoryRepository(
              this.categoryMapper,
              dataSource
            )
          ),
          this.dataSource
        )
      )
    this.discountExistenceService = new DiscountExistenceService(new OrmDiscountRepository(new OrmDiscountMapper(), this.dataSource))
  }

  /**
   * Endpoint para crear un nuevo bundle.
   * @param entry - Datos necesarios para crear el bundle.
   * @returns - Mensaje de éxito o error en caso de fallo.
   */
  @Post('create')
  @ApiOkResponse({
    description: 'Crea un nuevo bundle en la base de datos',
    type: CreateBundleEntryDTO,
  })
  async createBundle(@Body() entry: CreateBundleEntryDTO) {
    const data: CreateBundleServiceEntryDto = {
      userId: "24117a35-07b0-4890-a70f-a082c948b3d4",
      ...entry,
      currency: entry.currency as BundleCurrency, // Conversión explícita
      measurement: entry.measurement as Measurement
    };

    const service =
      new ExceptionDecorator(
        new LoggingDecorator(
          new CreateBundleApplicationService(
            this.bundleRepository,
            this.idGenerator,
            this.fileUploader,
            this.categoriesExistenceService,//
            this.productExistenceService,
            this.discountExistenceService
          ),
          new NativeLogger(this.logger)
        ),
        new HttpExceptionHandler()
      );

    const result = await service.execute(data);

    if (!result.isSuccess())
      return result.Error;

    return "Bundle creado";
  }

  // Resto del código del controlador sigue igual


  /**
   * Endpoint para obtener un bundle por ID.
   * @param id - ID del bundle.
   * @returns - Datos del bundle o un error si no se encuentra.
   */
  @Get('one/:id')
  async getBundleById(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<GetAllBundlesResponseDTO> {
    const entry: GetBundleByIdServiceEntryDTO = {
      userId: "24117a35-07b0-4890-a70f-a082c948b3d4",
      id_bundle: id,
    };

    const service = new LoggingDecorator(
      new GetBundleByIdService(this.bundleRepository),
      new NativeLogger(this.logger)
    );

    const result = await service.execute(entry);

    if (!result.isSuccess())
      throw result.Error;

    const response: GetAllBundlesResponseDTO = {
      ...result.Value
    };
    return response;
  }

  /**
   * Endpoint para obtener todos los bundles con paginación.
   * @param paginacion - Parámetros de paginación.
   * @param queryEntryParams - Parámetros adicionales de entrada.
   * @returns - Listado de bundles en formato paginado.
   */
  @Get('many')
  @ApiOkResponse({
    description: 'Devuelve la información de todos los combos en formato paginado',
    type: [GetAllBundlesResponseDTO], // Indica que se retorna un arreglo de DTOs
  })
  async getAllBundles(
    @Query() paginacion: PaginationDto,
    @Query() queryEntryParams: BundleParamsEntryDTO
  ): Promise<GetAllBundlesResponseDTO[]> {
    const service = new ExceptionDecorator(
      new LoggingDecorator(
        new FindAllBundlesApplicationService(this.bundleRepository),
        new NativeLogger(this.logger)
      ),
      new HttpExceptionHandler()
    );

    console.log("Page en controller paginacion Query =", paginacion.page)
    console.log("Limit en controller paginacion Query =", paginacion.perpage)


    const data: GetAllBundlesServiceEntryDTO = {
      userId: "24117a35-07b0-4890-a70f-a082c948b3d4",
      ...paginacion,
      ...queryEntryParams,
    };

    console.log("Page en controller data vari =", data.page)
    console.log("Limit en controller data vari =", data.perpage)

    const result = await service.execute(data);

    if (!result.isSuccess()) {
      throw result.Error;
    }

    const response: GetAllBundlesResponseDTO[] = result.Value.map((bundle) => ({
      id: bundle.id,
      name: bundle.name,
      description: bundle.description,
      price: bundle.price,
      currency: bundle.currency,
      images: bundle.images, // Corregido: Se incluye `images`
      weight: bundle.weight,
      measurement: bundle.measurement,
      stock: bundle.stock,
      category: bundle.category,
      productId: bundle.productId,
      discount: bundle.discount
    }));

    return response;
  }

  //"/bundle/:id"
  @Patch("/:id")
    @ApiOkResponse({
        description: 'Actualiza la imformacion de un combo',
        type: UpdateBundleResponseDTO,
    })
    async updateProudct(
        @Body() request: UpdateBundleEntryDTO
    ) {

        const data: UpdateBundleServiceEntryDto = {
            userId: '',
            ...request
        }

        const eventBus = EventBus.getInstance()

        console.log("request: ", request)

        const service =
            new ExceptionDecorator(
                new LoggingDecorator(
                    new PerformanceDecorator(
                        new UpdateBundleApplicationService (
                            this.bundleRepository,
                          eventBus
                        ),
                        new NativeLogger(this.logger)
                    ),
                    new NativeLogger(this.logger)
                ),
                new HttpExceptionHandler()
            )

        const result = await service.execute(data)

        const response: UpdateBundleResponseDTO = { ...result.Value }

        return response

    }

}
