import { IApplicationService } from "src/common/application/application-services/application-service.interface"
import { IDiscountRepository } from "src/discount/domain/repositories/discount.repository.interface";
import { GetAllDiscountServiceEntryDTO } from "../../dto/entry/get-all-discount-service.dto";
import { GetAllDiscountServiceResponseDto } from "../../dto/response/get-all-discount-service-response.dto";
import { Result } from "src/common/domain/result-handler/Result";



export class GetAllDiscountService implements IApplicationService<GetAllDiscountServiceEntryDTO, GetAllDiscountServiceResponseDto[]> {

    private readonly discountRepository: IDiscountRepository;

    constructor(discountRepository: IDiscountRepository) {
        this.discountRepository = discountRepository
    }

    async execute(data: GetAllDiscountServiceEntryDTO): Promise<Result<GetAllDiscountServiceResponseDto[]>> {
        data.page = data.page * data.limit - data.limit;

        const discounts = await this.discountRepository.findAllDiscounts(data.page, data.limit)

        if (!discounts.isSuccess)
            throw new Error("Method not implemented.")

        const response: GetAllDiscountServiceResponseDto[] = []

        discounts.Value.map(
            async (discount) => {
                response.push({
                    id: discount.Id.Value,
                    name: discount.Name.Value,
                    description: discount.Description.Value,
                    percentage: discount.Percentage.Value,
                    image: discount.Image.Image,
                    startDate: discount.StartDate.Value,
                    deadline: discount.Deadline.Value
                })
            }
        )

        return Result.success(response,202)
    }

    get name(): string {
        return this.constructor.name
    }
}