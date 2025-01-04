import { IApplicationService } from "src/common/application/application-services/application-service.interface";
import { IEventHandler } from "src/common/application/event-handler/event-handler.interface";
import { Result } from "src/common/domain/result-handler/Result";
import { IDiscountRepository } from "src/discount/domain/repositories/discount.repository.interface";
import { DeleteDiscountServiceEntryDto } from "../../dto/entry/delete-discount-service-entry.dto";
import { DeleteDiscountServiceResponseDto } from "../../dto/response/delete-discount-service-response.dto";

export class DeleteDiscountApplicationService 
  implements IApplicationService<DeleteDiscountServiceEntryDto, DeleteDiscountServiceResponseDto> {
  
  private readonly discountRepository: IDiscountRepository;
  private readonly eventHandler: IEventHandler;

  constructor(
    discountRepository: IDiscountRepository,
    eventHandler: IEventHandler
  ) {
    this.discountRepository = discountRepository;
    this.eventHandler = eventHandler;
  }

  async execute(data: DeleteDiscountServiceEntryDto): Promise<Result<DeleteDiscountServiceResponseDto>> {
    
    const discountResult = await this.discountRepository.deleteDiscount(data.id);

    if (!discountResult.isSuccess()) {
      return Result.fail<DeleteDiscountServiceResponseDto>(
        discountResult.Error,
        discountResult.StatusCode,
        discountResult.Message
      );
    }

    const deletedDiscount = discountResult.Value;

    this.eventHandler.publish(deletedDiscount.pullEvents());

    const response: DeleteDiscountServiceResponseDto = {
      id: deletedDiscount.Id.Value,
    };

    return Result.success<DeleteDiscountServiceResponseDto>(response, 200);
  }

  get name(): string {
    return this.constructor.name;
  }
}
