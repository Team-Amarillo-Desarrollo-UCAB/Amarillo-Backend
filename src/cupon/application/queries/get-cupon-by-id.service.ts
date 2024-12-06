import { IApplicationService } from "src/common/application/application-services/application-service.interface";
import { Result } from "src/common/domain/result-handler/Result";
import { GetCuponByIdServiceEntryDTO } from "../DTO/entry/get-cupon-by-id-service-entry.dto";
import { GetCuponByIdServiceResponseDTO } from "../DTO/response/get-cupon-by-id-service-response.dto";
import { ICuponRepository } from "src/cupon/domain/repositories/cupon-repository.interface";

export class GetCuponByIdService implements IApplicationService<GetCuponByIdServiceEntryDTO, GetCuponByIdServiceResponseDTO> {

    private readonly cuponRepository: ICuponRepository

    constructor(cuponRepository: ICuponRepository) {
        this.cuponRepository = cuponRepository
    }

    async execute(data: GetCuponByIdServiceEntryDTO): Promise<Result<GetCuponByIdServiceResponseDTO>> {

        const cupon = await this.cuponRepository.findCuponById(data.cuponId)

        if (!cupon.isSuccess())
            return Result.fail(new Error("Cupon no encontrado"), 404, "Producto no encontrado")

        const response: GetCuponByIdServiceResponseDTO = {
            cuponId: cupon.Value.Id.Id(),
            code: cupon.Value.Code(),
            amount: cupon.Value.Amount(),
            expiration_date: cupon.Value.ExpirationDate(),
            creation_date: cupon.Value.CreationDate()
        }

        return Result.success(response, 202)

    }

    get name(): string {
        return this.constructor.name
    }

}