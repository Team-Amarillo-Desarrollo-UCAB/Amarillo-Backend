import { IBundleRepository } from "src/bundle/domain/repositories/bundle-repository.interface";
import { IApplicationService } from "src/common/application/application-services/application-service.interface";
import { IEventHandler } from "src/common/application/event-handler/event-handler.interface";
import { Result } from "src/common/domain/result-handler/Result";
import { DeleteBundleServiceEntryDto } from "../../dto/entry/delete-bundle-service-entry.dto";
import { DeleteBundleServiceResponseDto } from "../../dto/response/delete-bundle-service-entry.dto";

export class DeleteBundleApplicationService 
  implements IApplicationService<DeleteBundleServiceEntryDto, DeleteBundleServiceResponseDto> {
  
  private readonly bundleRepository: IBundleRepository;
  private readonly eventHandler: IEventHandler;

  constructor(
    bundleRepository: IBundleRepository,
    eventHandler: IEventHandler
  ) {
    this.bundleRepository = bundleRepository;
    this.eventHandler = eventHandler;
  }

  async execute(data: DeleteBundleServiceEntryDto): Promise<Result<DeleteBundleServiceResponseDto>> {
    // Paso 1: Buscar el bundle en el repositorio
    const bundleResult = await this.bundleRepository.deleteBundle(data.id);

    if (!bundleResult.isSuccess()) {
      // Retorna error si el bundle no existe o no se puede eliminar
      return Result.fail<DeleteBundleServiceResponseDto>(
        bundleResult.Error,
        bundleResult.StatusCode,
        bundleResult.Message
      );
    }

    const deletedBundle = bundleResult.Value;

    // Paso 2: Publicar eventos de eliminación si es necesario
    this.eventHandler.publish(deletedBundle.pullEvents());

    // Paso 3: Preparar la respuesta
    const response: DeleteBundleServiceResponseDto = {
      deletedBundleId: deletedBundle.Id.Value,
    };

    return Result.success<DeleteBundleServiceResponseDto>(response, 200);
  }

  get name(): string {
    return this.constructor.name;
  }
}
