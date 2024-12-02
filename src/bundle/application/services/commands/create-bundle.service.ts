import { IApplicationService } from 'src/common/application/application-services/application-service.interface';
import { Result } from 'src/common/domain/result-handler/Result';
import { IBundleRepository } from 'src/bundle/domain/repositories/bundle-repository.interface';
import { IdGenerator } from 'src/common/application/id-generator/id-generator.interface';
import { BundleName } from 'src/bundle/domain/value-objects/bundle-name';
import { BundleImage } from 'src/bundle/domain/value-objects/bundle-image';
import { Bundle } from 'src/bundle/domain/bundle.entity';
import { IFileUploader } from 'src/common/application/file-uploader/file-uploader.interface';
import { BundleID } from 'src/bundle/domain/value-objects/bundle-id';
import { CreateBundleServiceEntryDto } from '../../dto/entry/create-bundle-service-entry.dto';
import { CreateBundleServiceResponseDTO } from '../../dto/response/create-bundle-service-response.dto';
import { BundleCaducityDate } from 'src/bundle/domain/value-objects/bundle-caducityDate';
import { BundleDescription } from 'src/bundle/domain/value-objects/bundle-description';
import { BundlePrice } from 'src/bundle/domain/value-objects/bundle-price';
import { BundleStock } from 'src/bundle/domain/value-objects/bundle-stock';
import { BundleWeight } from 'src/bundle/domain/value-objects/bundle-weight';
import { CategoriesExistenceService } from '../queries/categories-existence-check.service';
import { ProductsExistenceService } from '../queries/product-existence-check.service';

export class CreateBundleApplicationService
  implements IApplicationService<CreateBundleServiceEntryDto, CreateBundleServiceResponseDTO>
{
  private readonly bundleRepository: IBundleRepository;
  private readonly idGenerator: IdGenerator<string>;
  private readonly fileUploader: IFileUploader;
  private readonly categorieExistenceService: CategoriesExistenceService;
  private readonly productExistenceService: ProductsExistenceService;

  constructor(
    bundleRepository: IBundleRepository,
    idGenerator: IdGenerator<string>,
    fileUploader: IFileUploader,
    categorieExistenceService: CategoriesExistenceService, // Inyección del servicio de categorías
    productExistenceService: ProductsExistenceService // Inyección del servicio de productos
  ) {
    this.bundleRepository = bundleRepository;
    this.idGenerator = idGenerator;
    this.fileUploader = fileUploader;
    this.categorieExistenceService = categorieExistenceService;
    this.productExistenceService = productExistenceService;
  }

  async execute(data: CreateBundleServiceEntryDto): Promise<Result<CreateBundleServiceResponseDTO>> {
    // Generar un ID para el icono del bundle
    const iconId = await this.idGenerator.generateId();

    // Validar la existencia de las categorías
    const categoryResult = await this.categorieExistenceService.categoriesExistenceCheck(data.category);

    if (!categoryResult.isSuccess()) {
      return Result.fail(categoryResult.Error, categoryResult.StatusCode, categoryResult.Message);
    }

    // Validar la existencia de los productos
    const productResult = await this.productExistenceService.productsExistenceCheck(data.productId);

    if (!productResult.isSuccess()) {
      return Result.fail(productResult.Error, productResult.StatusCode, productResult.Message);
    }

    const iconUrls = await Promise.all(
      data.images.map(async (image) => {
        return this.fileUploader.UploadFile(image); // Subir cada imagen individualmente
      })
    );

    const bundleImages = iconUrls.map((url) => BundleImage.create(url));

    // Crear la entidad de bundle con sus respectivos V.O
    const bundle = Bundle.create(
      BundleID.create(await this.idGenerator.generateId()), // Genera un ID único para el bundle
      BundleName.create(data.name), // Crea el V.O del nombre
      BundleDescription.create(data.description), // Crea el V.O de la descripción
      BundleWeight.create(data.weight, data.measurement), // Crea el V.O del peso y su unidad de medida
      BundlePrice.create(data.price, data.currency), // Crea el V.O del precio y moneda
      categoryResult.Value, // Categorías validadas
      bundleImages, // Crea el V.O con el array de URLs
      BundleStock.create(data.stock), // Crea el V.O del stock
      productResult.Value, // Productos validado
      data.caducityDate ? BundleCaducityDate.create(data.caducityDate) : null // Crea el V.O opcional para caducidad
    );

    // Guarda el bundle en el repositorio pertinente :)
    const result = await this.bundleRepository.addBundle(bundle);

    if (!result.isSuccess()) {
      return Result.fail(new Error('ERROR: Bundle no creado'), 500, 'ERROR: Bundle no creado');
    }

    const response: CreateBundleServiceResponseDTO = {
      name: bundle.name.Value,
      description: bundle.description.Value,
      images: bundle.images.map((image) => image.Value),
      price: bundle.price.Price,
      currency: bundle.price.Currency,
      weight: bundle.weight.Weight,
      measurement: bundle.weight.Measurement,
      stock: bundle.stock.Value,
      category: bundle.categories.map((category) => category.Value),
      productId: bundle.products.map((product) => product.Id),
      caducityDate: bundle.caducityDate?.Value ?? null,
    };

    // Retorna éxito si el bundle se guarda correctamente
    return Result.success(response, 200);
  }

  get name(): string {
    return this.constructor.name;
  }
}
