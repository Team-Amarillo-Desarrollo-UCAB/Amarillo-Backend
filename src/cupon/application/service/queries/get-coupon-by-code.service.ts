import { IApplicationService } from "src/common/application/application-services/application-service.interface";
import { Result } from "src/common/domain/result-handler/Result";
import { ICuponRepository } from "src/cupon/domain/repositories/cupon-repository.interface";
import { IProductRepository } from "src/product/domain/repositories/product-repository.interface";
import { GetCouponByCodeServiceEntryDTO } from "../../DTO/entry/get-coupon-by-code-service-entry.dto";
import { GetCouponByCodeServiceResponseDTO } from "../../DTO/response/get-cupon-by-code-service-response.dto";


export class GetCouponByCodeService implements IApplicationService<GetCouponByCodeServiceEntryDTO, GetCouponByCodeServiceResponseDTO> {

    private readonly cuponRepository: ICuponRepository

    constructor(cuponRepository: ICuponRepository) {
        this.cuponRepository = cuponRepository
    }

    async execute(data: GetCouponByCodeServiceEntryDTO): Promise<Result<GetCouponByCodeServiceResponseDTO>> {

        const coupon = await this.cuponRepository.findCuponByCode(data.cuponCode)

        if (!coupon.isSuccess())
            return Result.fail(new Error("Cupón no encontrado"), 404, "Cupón no encontrado")

        const response: GetCouponByCodeServiceResponseDTO = {
            code: coupon.Value.Code(),
            expiration_date: coupon.Value.ExpirationDate(),
            amount: Number(coupon.Value.Amount())
        }

        return Result.success(response,202)
    }

    get name(): string {
        return this.constructor.name
    }

}