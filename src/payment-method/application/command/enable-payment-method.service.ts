import { IApplicationService } from "src/common/application/application-services/application-service.interface";
import { IPaymentMethodRepository } from "src/payment-method/domain/repositories/payment-method-repository.interface";
import { Result } from "src/common/domain/result-handler/Result";
import { EnablePaymentMethodServiceEntryDTO } from "../dto/entry/enable-payment-method-entry.dto";
import { EnablePaymentMethodServiceResponseDTO } from "../dto/response/enable-payment-method-response.dto";

export class EnablePaymentMethodService implements
    IApplicationService<EnablePaymentMethodServiceEntryDTO, EnablePaymentMethodServiceResponseDTO> {

    private readonly paymentMethodRepository: IPaymentMethodRepository

    constructor(paymentMethodRepository: IPaymentMethodRepository) {
        this.paymentMethodRepository = paymentMethodRepository
    }

    async execute(data: EnablePaymentMethodServiceEntryDTO): Promise<Result<EnablePaymentMethodServiceResponseDTO>> {
        const metodo = await this.paymentMethodRepository.findPaymentMethodById(data.id_payment_method)

        if (!metodo.isSuccess())
            return Result.fail<EnablePaymentMethodServiceResponseDTO>(metodo.Error, metodo.StatusCode, metodo.Message)

        metodo.Value.enableMethod()

        const resuslt = await this.paymentMethodRepository.savePaymentMethodAggregate(metodo.Value)

        if (!resuslt.isSuccess())
            return Result.fail<EnablePaymentMethodServiceResponseDTO>(resuslt.Error, resuslt.StatusCode, resuslt.Message)

        return Result.success<EnablePaymentMethodServiceResponseDTO>({ id_payment_method: resuslt.Value.Id.Id }, 200)
    }

    get name(): string {
        return this.constructor.name
    }
}