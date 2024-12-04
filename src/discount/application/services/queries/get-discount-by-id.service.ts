import { IApplicationService } from "src/common/application/application-services/application-service.interface";
import { Result } from "src/common/domain/result-handler/Result";
import { IDiscountRepository } from "src/discount/domain/repositories/discount.repository.interface";
import { GetDiscountByIdServiceEntryDto } from "../../dto/entry/get-discount-by-id-service-entry.dto";
import { GetDiscountByIdServiceResponseDto } from "../../dto/response/get-discount-by-id-service-responde.dto";

export class GetDiscountByIdService
  implements IApplicationService<GetDiscountByIdServiceEntryDto, GetDiscountByIdServiceResponseDto>
{
  private readonly discountRepository: IDiscountRepository;

  constructor(discountRepository: IDiscountRepository) {
    this.discountRepository = discountRepository;
  }

  async execute(data: GetDiscountByIdServiceEntryDto): Promise<Result<GetDiscountByIdServiceResponseDto>> {
    // Buscar el descuento por ID utilizando el repositorio
    const discount = await this.discountRepository.findDiscountById(data.id_discount);

    // Verificar si el descuento no fue encontrado
    if (!discount.isSuccess()) {
      return Result.fail(new Error("Descuento no encontrado"), 404, "Descuento no encontrado");
    }

    // Construir el DTO de respuesta a partir de los valores de la entidad
    const response: GetDiscountByIdServiceResponseDto = {
      id: discount.Value.Id.Value,
      name: discount.Value.Name.Value,
      description: discount.Value.Description.Value,
      percentage: discount.Value.Percentage.Value,
      startDate: discount.Value.StartDate.Value,
      deadline: discount.Value.Deadline.Value,
    };

    // Devolver el resultado exitoso con el DTO
    return Result.success(response, 202);
  }

  get name(): string {
    return this.constructor.name;
  }
}
