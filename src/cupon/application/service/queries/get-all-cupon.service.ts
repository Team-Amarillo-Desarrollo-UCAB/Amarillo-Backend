import { IApplicationService } from "src/common/application/application-services/application-service.interface"
import { ICuponRepository } from "src/cupon/domain/repositories/cupon-repository.interface"
import { GetAllCuponServiceEntryDTO } from "../../DTO/entry/get-all-cupon-service-entry.dto"
import { Result } from "src/common/domain/result-handler/Result"
import { GetAllCuponServiceResponseDTO } from "../../DTO/response/get-all-cupon-service-response.dto"


export class GetAllCouponService implements IApplicationService<GetAllCuponServiceEntryDTO, GetAllCuponServiceResponseDTO[]> {

    private readonly cuponRepository: ICuponRepository

    constructor(cuponRepository: ICuponRepository) {
        this.cuponRepository = cuponRepository
    }

    async execute(data: GetAllCuponServiceEntryDTO): Promise<Result<GetAllCuponServiceResponseDTO[]>> {

        data.page = (data.page * data.perpage) - data.perpage;

        console.log(data.page)

        const coupons = await this.cuponRepository.findAllCoupons(data.page, data.perpage)

        if (!coupons.isSuccess())
            throw new Error("Method not implemented.")

        const response: GetAllCuponServiceResponseDTO[] = []

        coupons.Value.map(
            async (coupon) => {
                response.push({
                    id_cupon: coupon.Id.Id(),
                    code: coupon.Code(),
                    expiration_date: coupon.ExpirationDate(),
                    amount: coupon.Amount()
                })
            }
        )

        return Result.success(response, 202)
    }

    get name(): string {
        return this.constructor.name
    }
}