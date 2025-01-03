import { IApplicationService } from "src/common/application/application-services/application-service.interface";
import { GetCategoryByIdServiceEntryDTO } from "../dto/entry/get-category-by-id-service-entry";
import { GetCategoryByIdServiceResponseDTO } from "../dto/response/get-category-by-id-service-response.dto";
import { Result } from "src/common/domain/result-handler/Result";
import { ICategoryRepository } from "src/category/domain/repositories/category-repository.interface";

export class GetCategoryByIdService implements IApplicationService<GetCategoryByIdServiceEntryDTO, GetCategoryByIdServiceResponseDTO>{
    
    private readonly categoryRepository: ICategoryRepository;

  constructor(categoryRepository: ICategoryRepository) {
    this.categoryRepository = categoryRepository;
  }
    
    async execute(data: GetCategoryByIdServiceEntryDTO): Promise<Result<GetCategoryByIdServiceResponseDTO>> {
        const category = await this.categoryRepository.findCategoryById(data.id)

        if (!category.isSuccess())
            return Result.fail(new Error("Categoría no encontrada"), 404, "Categoría no encontrada")

        const response: GetCategoryByIdServiceResponseDTO = {

            id:category.Value.Id.Value,
            name:category.Value.getCategoryName().Value,
            image:category.Value.getCategoryImage().Value,

        }

        return Result.success(response,202)

    }
    get name(): string {
        return this.constructor.name;
    }
    
}