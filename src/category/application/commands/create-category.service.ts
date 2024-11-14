import { IApplicationService } from 'src/common/application/application-services/application-service.interface';
import { Result } from 'src/common/domain/result-handler/Result';
import { ICategoryRepository } from 'src/category/domain/repositories/category-repository.interface';
import { IdGenerator } from 'src/common/application/id-generator/id-generator.interface';
import { CategoryName } from 'src/category/domain/value-objects/category-name';
import { CategoryImage } from 'src/category/domain/value-objects/category-image';
import { CreateCategoryServiceEntryDto } from '../dto/entry/create-category-service-entry.dto';
import { CreateCategoryServiceResponseDTO } from '../dto/response/create-category-service-response.dto';
import { Category } from 'src/category/domain/category.entity';
import { IFileUploader } from 'src/common/application/file-uploader/file-uploader.interface';
import { CategoryID } from 'src/category/domain/value-objects/category-id';

export class CreateCategoryApplicationService
  implements IApplicationService<CreateCategoryServiceEntryDto, CreateCategoryServiceResponseDTO>
{
  private readonly categoryRepository: ICategoryRepository;
  private readonly idGenerator: IdGenerator<string>;
  private readonly fileUploader: IFileUploader;

  constructor(
    categoryRepository: ICategoryRepository,
    idGenerator: IdGenerator<string>,
    fileUploader: IFileUploader,
    //event handler por ahora no
  ) {
    this.categoryRepository = categoryRepository;
    this.idGenerator = idGenerator;
    this.fileUploader = fileUploader;
  }

  async execute(data: CreateCategoryServiceEntryDto): Promise<Result<CreateCategoryServiceResponseDTO>> {
    //revisar este try catch creo que no aplica
    // Generar un ID para el icono de la categoría
    const iconId = await this.idGenerator.generateId();
    console.log('iconId', iconId);

    // Subir el archivo de icono y obtener la URL resultante
    //const iconUrl = await this.fileUploader.UploadFile(data.icon, iconId);
    //console.log('iconUrl', iconUrl);

    // Crear la entidad de categoría con sus respectivos V.O
    const category = Category.create(
      CategoryID.create(await this.idGenerator.generateId()), // Genera un ID único para la categoría
      CategoryName.create(data.name),// Crea el V.O del nombre
      CategoryImage.create(data.icon)// Crea el V.O de la imagen con la URL
    );

    // Guarda la categoría en el repositorio pertinente :)
    const result = await this.categoryRepository.addCategory(category);

    if (!result.isSuccess()) {
      return Result.fail(new Error("ERROR: Categoría no creada"), 500, "ERROR: Categoría no creada");
    }

    const response: CreateCategoryServiceResponseDTO ={
      categoryID:category.Id.Value,
      categoryName:category.getCategoryName().Value,
      categoryImage:category.getCategoryImage().Value,
    }

    // Retorna éxito si la categoría se guarda correctamente
    return Result.success(response, 200);

  }

  get name(): string {
    return this.constructor.name;
  }
}
