import { IApplicationService } from "src/common/application/application-services/application-service.interface";
import { IEventHandler } from "src/common/application/event-handler/event-handler.interface";
import { Result } from "src/common/domain/result-handler/Result";
import { IDiscountRepository } from "src/discount/domain/repositories/discount.repository.interface";
import { DiscountDescription } from "src/discount/domain/value-objects/discount-description";
import { DiscountName } from "src/discount/domain/value-objects/discount-name";
import { DiscountPercentage } from "src/discount/domain/value-objects/discount-percentage";
import { UpdateDiscountServiceEntryDto } from "../../dto/entry/update-discount-service-entry.dto";
import { UpdateDiscountServiceResponseDto } from "../../dto/response/update-discount-service-response.dto";
import { DiscountStartDate } from "src/discount/domain/value-objects/discount-start-date";
import { Deadline } from '../../../domain/value-objects/discount-deadline';
import { DiscountImage } from "src/discount/domain/value-objects/discount-image";


export class UpdateDiscountApplicationService
  implements IApplicationService<UpdateDiscountServiceEntryDto, UpdateDiscountServiceResponseDto>
{
  private readonly discountRepository: IDiscountRepository;
  private readonly eventHandler: IEventHandler;

  constructor(
    discountRepository: IDiscountRepository,
    eventHandler: IEventHandler
  ) {
    this.discountRepository = discountRepository;
    this.eventHandler = eventHandler;
  }

  async execute(
    data: UpdateDiscountServiceEntryDto
  ): Promise<Result<UpdateDiscountServiceResponseDto>> {
    const discountResult = await this.discountRepository.findDiscountById(data.id);

    if (!discountResult.isSuccess()) {
      return Result.fail<UpdateDiscountServiceResponseDto>(
        new Error("Descuento a actualizar no existente"),
        404,
        "Descuento a actualizar no existente."
      );
    }

    const discountR = discountResult.Value;

    if (data.name) {
    //   const verifyName = await this.discountRepository.findAllDiscounts(null, null, data.name, null, null);
    //   if (verifyName.Value.length !== 0) {
    //     return Result.fail(
    //       new Error("Ya existe un descuento con ese nombre registrado"),
    //       409,
    //       "Ya existe un descuento con ese nombre registrado"
    //     );
    //   }
      discountR.updateName(DiscountName.create(data.name));
    }

    if (data.description) {
      discountR.updateDescription(DiscountDescription.create(data.description));
    }

    if (data.percentage) {
      discountR.updatePercentage(DiscountPercentage.create(data.percentage));

    }

    if(data.startDate){
      discountR.updateStartDate(DiscountStartDate.create(data.startDate))
    }

    if(data.deadline){
      discountR.updateDeadline(Deadline.create(data.deadline))
    }


    if (data.image) {
      discountR.updateImage(DiscountImage.create(data.image));
    }

    const updateResult = await this.discountRepository.updateDiscount(discountR);

    if (!updateResult.isSuccess()) {
      return Result.fail<UpdateDiscountServiceResponseDto>(
        new Error("Descuento no modificado"),
        updateResult.StatusCode,
        "Descuento no modificado"
      );
    }

    const response: UpdateDiscountServiceResponseDto = {
      id: data.id,
    };

    return Result.success<UpdateDiscountServiceResponseDto>(response, 200);
  }

  get name(): string {
    return this.constructor.name;
  }
}
