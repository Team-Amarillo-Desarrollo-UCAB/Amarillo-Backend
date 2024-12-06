import { IApplicationService } from "src/common/application/application-services/application-service.interface";
import { DisablePaymentMethodServiceEntryDTO } from '../dto/entry/disable-payment-method-service-entry.dto';
import { DisablePaymentMethodServiceResponseDTO } from "../dto/response/disable-payment-method-service-response.dto";
import { IPaymentMethodRepository } from "src/payment-method/domain/repositories/payment-method-repository.interface";
import { Result } from "src/common/domain/result-handler/Result";

export class DisablePaymentMethodService implements
    IApplicationService<DisablePaymentMethodServiceEntryDTO, DisablePaymentMethodServiceResponseDTO> {

    private readonly paymentMethodRepository: IPaymentMethodRepository

    constructor(paymentMethodRepository: IPaymentMethodRepository) {
        this.paymentMethodRepository = paymentMethodRepository
    }

    async execute(data: DisablePaymentMethodServiceEntryDTO): Promise<Result<DisablePaymentMethodServiceResponseDTO>> {
        const metodo = await this.paymentMethodRepository.findPaymentMethodById(data.id_payment_method)

        if (!metodo.isSuccess())
            return Result.fail<DisablePaymentMethodServiceResponseDTO>(metodo.Error, metodo.StatusCode, metodo.Message)

        metodo.Value.disableMethod()

        const resuslt = await this.paymentMethodRepository.savePaymentMethodAggregate(metodo.Value)

        if (!resuslt.isSuccess())
            return Result.fail<DisablePaymentMethodServiceResponseDTO>(resuslt.Error, resuslt.StatusCode, resuslt.Message)

        return Result.success<DisablePaymentMethodServiceResponseDTO>({ id_payment_method: resuslt.Value.Id.Id }, 200)
    }

    get name(): string {
        return this.constructor.name
    }
}