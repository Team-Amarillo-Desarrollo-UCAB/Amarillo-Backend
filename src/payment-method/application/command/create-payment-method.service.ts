import { IApplicationService } from "src/common/application/application-services/application-service.interface";
import { CreatePaymentMethodServiceEntryDTO } from "../dto/entry/create-payment-method-entry.dto";
import { CreatePaymentMethodServiceResponseDTO } from "../dto/response/create-payment-method-response.dto";
import { Result } from "src/common/domain/result-handler/Result";
import { IPaymentMethodRepository } from "src/payment-method/domain/repositories/payment-method-repository.interface";
import { IdGenerator } from "src/common/application/id-generator/id-generator.interface";
import { PaymentMethod } from "src/payment-method/domain/payment-method";
import { PaymentMethodName } from "src/payment-method/domain/value-objects/payment-method-name";
import { PaymentMethodId } from "src/payment-method/domain/value-objects/payment-method-id";
import { PaymentMethodState } from "src/payment-method/domain/value-objects/payment-method-state";

export class CreatePaymentMethodService implements IApplicationService
    <CreatePaymentMethodServiceEntryDTO, CreatePaymentMethodServiceResponseDTO> {

    constructor(
        private readonly paymentMethodRepository: IPaymentMethodRepository,
        private readonly idGenerator: IdGenerator<string>
    ) { }

    async execute(data: CreatePaymentMethodServiceEntryDTO): Promise<Result<CreatePaymentMethodServiceResponseDTO>> {

        if(!this.paymentMethodRepository.verifyPaymentMethodByName(data.name))
            return Result.fail<CreatePaymentMethodServiceResponseDTO>(new Error("Metodo de pago ya registrado"),404,"Metodo de pago ya registrado")

        const payment_method = PaymentMethod.create(
            PaymentMethodId.create(await this.idGenerator.generateId()),
            PaymentMethodName.create(data.name),
            PaymentMethodState.create(data.active)
        )

        const result = await this.paymentMethodRepository.savePaymentMethodAggregate(payment_method)

        if(!result.isSuccess())
            return Result.fail<CreatePaymentMethodServiceResponseDTO>(result.Error,result.StatusCode,result.Message)

        const response: CreatePaymentMethodServiceResponseDTO = {
            id_payment_method: result.Value.Id.Id
        }

        return Result.success(response,200)
    }

    get name(): string {
        return this.constructor.name
    }

}