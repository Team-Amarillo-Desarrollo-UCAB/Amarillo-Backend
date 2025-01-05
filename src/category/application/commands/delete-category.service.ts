import { ICategoryRepository } from "src/category/domain/repositories/category-repository.interface";
import { IApplicationService } from "src/common/application/application-services/application-service.interface";
import { IEventHandler } from "src/common/application/event-handler/event-handler.interface";
import { Result } from "src/common/domain/result-handler/Result";
import { DeleteCategoryServiceEntryDto } from "../dto/entry/delete-category-service-entry.dto";
import { DeleteCategoryServiceResponseDto } from "../dto/response/delete-category-service-response.dto";

export class DeleteCategoryApplicationService 
  implements IApplicationService<DeleteCategoryServiceEntryDto, DeleteCategoryServiceResponseDto> {
  
  private readonly categoryRepository: ICategoryRepository;
  private readonly eventHandler: IEventHandler;

  constructor(
    categoryRepository: ICategoryRepository,
    eventHandler: IEventHandler
  ) {
    this.categoryRepository = categoryRepository;
    this.eventHandler = eventHandler;
  }

  async execute(data: DeleteCategoryServiceEntryDto): Promise<Result<DeleteCategoryServiceResponseDto>> {
    // Paso 1: Buscar la categoría en el repositorio
    const categoryResult = await this.categoryRepository.deleteCategory(data.id);

    if (!categoryResult.isSuccess()) {
      // Retorna error si la categoría no existe o no se puede eliminar
      return Result.fail<DeleteCategoryServiceResponseDto>(
        categoryResult.Error,
        categoryResult.StatusCode,
        categoryResult.Message
      );
    }

    const deletedCategory = categoryResult.Value;

    // Paso 2: Publicar eventos de eliminación si es necesario
    this.eventHandler.publish(deletedCategory.pullEvents());

    // Paso 3: Preparar la respuesta
    const response: DeleteCategoryServiceResponseDto = {
      id: deletedCategory.Id.Value,
    };

    return Result.success<DeleteCategoryServiceResponseDto>(response, 200);
  }

  get name(): string {
    return this.constructor.name;
  }
}