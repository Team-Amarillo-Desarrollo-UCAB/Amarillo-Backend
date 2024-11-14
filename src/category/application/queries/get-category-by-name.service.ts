import { IApplicationService } from "src/common/application/application-services/application-service.interface";
import { GetCategoryByNameServiceEntryDTO } from "../dto/entry/get-category-by-name-service-entry.dto";
import { GetCategoryByNameServiceResponseDTO } from "../dto/response/get-category-by-name-service-response.dto";
import { Result } from "src/common/domain/result-handler/Result";
import { ICategoryRepository } from "src/category/domain/repositories/category-repository.interface";

export class GetCategoryByNameService implements IApplicationService<GetCategoryByNameServiceEntryDTO, GetCategoryByNameServiceResponseDTO>{

    private readonly categoryRepository: ICategoryRepository;

  constructor(categoryRepository: ICategoryRepository) {
    this.categoryRepository = categoryRepository;
  }
    async execute(data: GetCategoryByNameServiceEntryDTO): Promise<Result<GetCategoryByNameServiceResponseDTO>> {
        const category = await this.categoryRepository.findCategoryByName(data.name)

        if (!category.isSuccess())
            return Result.fail(new Error("Categoría no encontrada"), 404, "Categoría no encontrada")

        const response: GetCategoryByNameServiceResponseDTO = {

            categoryID:category.Value.Id.Value,
            categoryName:category.Value.getCategoryName().Value,
            categoryImage:category.Value.getCategoryImage().Value,

        }

        return Result.success(response,202)

    }
    get name(): string {
        return this.constructor.name;
    }

}