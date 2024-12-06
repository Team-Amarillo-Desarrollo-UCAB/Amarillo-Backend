import { IApplicationService } from "src/common/application/application-services/application-service.interface";
import { GetAllPaymentMethodServiceEntryDTO } from "../dto/entry/get-all-payment-method-entry.dto";
import { GetAllPaymentMethodResponseDTO } from "../dto/response/get-all-payment-method-response.dto";
import { IPaymentMethodRepository } from "src/payment-method/domain/repositories/payment-method-repository.interface";
import { Result } from "src/common/domain/result-handler/Result";

export class GetAllPaymentMethodService implements
    IApplicationService<GetAllPaymentMethodServiceEntryDTO, GetAllPaymentMethodResponseDTO[]> {

    private readonly paymentMethodRepository: IPaymentMethodRepository

    constructor(paymentMethodRepository: IPaymentMethodRepository) {
        this.paymentMethodRepository = paymentMethodRepository
    }

    async execute(data: GetAllPaymentMethodServiceEntryDTO): Promise<Result<GetAllPaymentMethodResponseDTO[]>> {
        data.page = data.page * data.limit - data.limit;

        const metodos = await this.paymentMethodRepository.findAllPaymentMethod(data.page, data.limit)

        if (!metodos.isSuccess)
            return Result.fail<GetAllPaymentMethodResponseDTO[]>(metodos.Error,metodos.StatusCode,metodos.Message)

        const response: GetAllPaymentMethodResponseDTO[] = []

        metodos.Value.map(
            async (metodo) => {
                response.push({
                    id_payment: metodo.Id.Id,
                    name: metodo.NameMethod().Value(),
                    active: metodo.Status().Value()
                })
            }
        )

        return Result.success(response, 202)
    }

    get name(): string {
        return this.constructor.name
    }
}