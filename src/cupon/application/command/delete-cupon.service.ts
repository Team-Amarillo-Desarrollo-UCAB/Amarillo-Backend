import { ICategoryRepository } from "src/category/domain/repositories/category-repository.interface";
import { IApplicationService } from "src/common/application/application-services/application-service.interface";
import { IEventHandler } from "src/common/application/event-handler/event-handler.interface";
import { Result } from "src/common/domain/result-handler/Result";
import { DeleteCuponServiceEntryDto } from "../DTO/entry/delete-cupon-service-entry.dto";
import { DeleteCuponServiceResponseDto } from "../DTO/response/delete-cupon-service-response.dto";
import { ICuponRepository } from "src/cupon/domain/repositories/cupon-repository.interface";

export class DeleteCouponApplicationService 
  implements IApplicationService<DeleteCuponServiceEntryDto, DeleteCuponServiceResponseDto> {
  
  private readonly cuponRepository: ICuponRepository;

  constructor(
    cuponRepository: ICuponRepository,
  ) {
    this.cuponRepository = cuponRepository;
  }

  async execute(data: DeleteCuponServiceEntryDto): Promise<Result<DeleteCuponServiceResponseDto>> {
    const cuponResult = await this.cuponRepository.deleteCupon(data.cuponId);

    if (!cuponResult.isSuccess()) {
      return Result.fail<DeleteCuponServiceResponseDto>(
        cuponResult.Error,
        cuponResult.StatusCode,
        cuponResult.Message
      );
    }

    const deletedCupon = cuponResult.Value;

    // Paso 3: Preparar la respuesta
    const response: DeleteCuponServiceResponseDto = {
        cuponId: deletedCupon.Id.Id()
    };

    return Result.success<DeleteCuponServiceResponseDto>(response, 200);
  }

  get name(): string {
    return this.constructor.name;
  }
}