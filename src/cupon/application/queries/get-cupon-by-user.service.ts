import { IApplicationService } from "src/common/application/application-services/application-service.interface";
import { Result } from "src/common/domain/result-handler/Result";
import { GetCuponByIdServiceResponseDTO } from "../DTO/response/get-cupon-by-id-service-response.dto";
import { ICuponRepository } from "src/cupon/domain/repositories/cupon-repository.interface";
import { GetCuponByUserServiceEntryDTO } from "../DTO/entry/get-cupon-by-user-service-entry.dto";
import { UserId } from "src/user/domain/value-object/user-id";
import { GetAllCuponServiceResponseDTO } from "../DTO/response/get-all-cupon-service-response.dto";

export class GetCuponByUserService implements
    IApplicationService<GetCuponByUserServiceEntryDTO, GetAllCuponServiceResponseDTO[]> {

    private readonly cuponRepository: ICuponRepository

    constructor(cuponRepository: ICuponRepository) {
        this.cuponRepository = cuponRepository
    }

    async execute(data: GetCuponByUserServiceEntryDTO): Promise<Result<GetAllCuponServiceResponseDTO[]>> {

        try {
            const cupones = await this.cuponRepository.findAllCuponsByUser(UserId.create(data.userId))

            if (!cupones.isSuccess())
                return Result.fail(new Error("Cupones no encontrado"), cupones.StatusCode, "Cupones no encontrados")

            const response: GetAllCuponServiceResponseDTO[] = cupones.Value.map((cupon) => {
                return {
                    id_cupon: cupon.Id.Id(),
                    code: cupon.Code(),
                    amount: Number(cupon.Amount()),
                    expiration_date: cupon.ExpirationDate(),
                    creation_date: cupon.CreationDate()
                }
            })

            return Result.success<GetAllCuponServiceResponseDTO[]>(response, 202)
        } catch (error) {
            return Result.fail<GetAllCuponServiceResponseDTO[]>(error, 500, error.message)
        }

    }

    get name(): string {
        return this.constructor.name
    }

}