import { IApplicationService } from "src/common/application/application-services/application-service.interface";
import { CreateCuponServiceEntryDto } from "../DTO_1/entry/create-cupon-service-entry.dto";
import { CreateCuponServiceResponseDto } from "../DTO_1/response/create-cupon-service-response.dto";
import { Result } from "src/common/domain/result-handler/Result";
import { ICuponRepository } from "src/cupon/domain/repositories/cupon-repository.interface";
import { IdGenerator } from "src/common/application/id-generator/id-generator.interface";
import { Cupon } from "src/cupon/domain/cupon";
import { CuponId } from "src/cupon/domain/value-objects/cupon-id";
import { CuponCode } from "src/cupon/domain/value-objects/cupon-code";
import { CuponExpirationDate } from "src/cupon/domain/value-objects/cupon-expiration-date";
import { CuponAmount } from "src/cupon/domain/value-objects/cupon-amount";
import { CuponCreationDate } from "src/cupon/domain/value-objects/cupon-creation-date";

export class CreateCuponService implements IApplicationService
    <CreateCuponServiceEntryDto, CreateCuponServiceResponseDto> {


    constructor(
        private readonly cuponRepository: ICuponRepository,
        private readonly idGenerator: IdGenerator<string>,
    ) {

    }

    async execute(data: CreateCuponServiceEntryDto): Promise<Result<CreateCuponServiceResponseDto>> {
        const verify_code = await this.cuponRepository.verifyCuponCode(data.code)
        if (!verify_code.isSuccess())
            return Result.fail(new Error("Codigo del cupon ya esta registrado"), 404, "Codigo del cupon ya esta registrado")

        const cupon = Cupon.create(
            CuponId.create(await this.idGenerator.generateId()),
            CuponCode.create(data.code),
            CuponExpirationDate.create(data.expiration_date),
            CuponAmount.create(data.amount),
            CuponCreationDate.create(new Date())
        )

        const result = await this.cuponRepository.saveCuponAggregate(cupon)
        if (!result.isSuccess()) return Result.fail(result.Error, result.StatusCode, result.Message)

        const response: CreateCuponServiceResponseDto = {
            cuponid: cupon.Code()
        }
        return Result.success(response, 200)
    }

    get name(): string {
        return this.constructor.name
    }

}