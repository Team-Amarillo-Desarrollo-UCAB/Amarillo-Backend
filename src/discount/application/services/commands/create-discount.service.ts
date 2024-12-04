import { IApplicationService } from 'src/common/application/application-services/application-service.interface';
import { Result } from 'src/common/domain/result-handler/Result';
import { IdGenerator } from 'src/common/application/id-generator/id-generator.interface';
import { DiscountID } from 'src/discount/domain/value-objects/discount-id';
import { DiscountName } from 'src/discount/domain/value-objects/discount-name';
import { DiscountDescription } from 'src/discount/domain/value-objects/discount-description';
import { DiscountPercentage } from 'src/discount/domain/value-objects/discount-percentage';
import { DiscountStartDate } from 'src/discount/domain/value-objects/discount-start-date';
import { Discount } from 'src/discount/domain/discount.entity';
import { IDiscountRepository } from 'src/discount/domain/repositories/discount.repository.interface';
import { CreateDiscountServiceEntryDto } from '../../dto/entry/create-discount-service-entry.dto';
import { CreateDiscountServiceResponseDto } from '../../dto/response/create-discount-service-response.dto';
import { IFileUploader } from 'src/common/application/file-uploader/file-uploader.interface';
import { Deadline } from 'src/discount/domain/value-objects/discount-deadline';

export class CreateDiscountApplicationService
  implements IApplicationService<CreateDiscountServiceEntryDto, CreateDiscountServiceResponseDto>
{
  private readonly discountRepository: IDiscountRepository;
  private readonly idGenerator: IdGenerator<string>;


  constructor(discountRepository: IDiscountRepository, 
    idGenerator: IdGenerator<string>,
   ) {
    this.discountRepository = discountRepository;
    this.idGenerator = idGenerator;
  }

  async execute(data: CreateDiscountServiceEntryDto): Promise<Result<CreateDiscountServiceResponseDto>> {

        // Crear la entidad `Discount`
        const discount = Discount.create(
            DiscountID.create(await this.idGenerator.generateId()), // Generar un ID único
            DiscountName.create(data.name), // Crear V.O para el nombre
            DiscountDescription.create(data.description), // Crear V.O para la descripción
            DiscountPercentage.create(data.percentage), // Porcentaje validado
            DiscountStartDate.create(data.startDate), // Fecha de inicio validada
            Deadline.create(data.deadline) // Fecha límite validada
          );
    
    const result = await this.discountRepository.addDiscount(discount)

    if (!result.isSuccess()) {
      return Result.fail(new Error("ERROR: Descuento no creado"), 500, "DESCUENTO no creado");
    }

    // Construir la respuesta de éxito
    const response: CreateDiscountServiceResponseDto = {
      id: discount.Id.Value,
      name: discount.Name.Value,
      description: discount.Description.Value,
      percentage: discount.Percentage.Value,
      startDate: discount.StartDate.Value,
      deadline: discount.Deadline.Value
    };

    return Result.success(response, 201); // Devolver resultado exitoso
  }

  get name(): string {
    return this.constructor.name;
  }
}
