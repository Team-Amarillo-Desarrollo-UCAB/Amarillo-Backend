import { IApplicationService } from 'src/common/Application/application-services/application-service.interface';
import { Result } from 'src/common/Domain/result-handler/Result';
import { ICategoryRepository } from 'src/category/domain/repositories/category-repository.interface';
import { GetAllCategoriesServiceEntryDTO } from '../dto/entry/get-all-categories-service-entry.dto';
import { GetAllCategoriesServiceResponseDTO } from '../dto/response/get-all-category-service-response.dto';

export class FindAllCategoriesApplicationService
  implements IApplicationService<GetAllCategoriesServiceEntryDTO, GetAllCategoriesServiceResponseDTO[]>//array porque devuelve una coleccion de categorias
{
  private readonly categoryRepository: ICategoryRepository;

  constructor(categoryRepository: ICategoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  async execute(data: GetAllCategoriesServiceEntryDTO): Promise<Result<GetAllCategoriesServiceResponseDTO[]>> {
    data.page = data.page * data.limit - data.limit;
    // Obtener todas las categorías desde el repositorio
    const categoriesResult = await this.categoryRepository.findAllCategories(data.page,data.limit);

    

    if (!categoriesResult.isSuccess()) {
      // Devolver un fallo si algo sale mal en el repositorio
      return Result.fail(new Error("ERROR al hallar"),500,"ERROR al hallar");
    }

    const response: GetAllCategoriesServiceResponseDTO[] = []

    // Mapear las entidades de categoría a DTOs de respuesta directamente en el servicio
    const categoriesDto = categoriesResult.Value.map(async(category) => response.push({
      categoryID: category.getCategoryID().Value,     
      categoryName: category.getCategoryName().Value,   
      categoryImage: category.getCategoryImage().Value 
    }));

    return Result.success(response, 202);
  }

  get name(): string {
    return this.constructor.name;
  }
}