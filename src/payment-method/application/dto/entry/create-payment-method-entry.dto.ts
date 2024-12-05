import { ApplicationServiceEntryDto } from "src/common/application/application-services/DTO/application-service-entry.dto";
import { EnumPaymentMethod } from "src/payment-method/domain/enum/PaymentMethod";

export interface CreatePaymentMethodServiceEntryDTO extends ApplicationServiceEntryDto {

    name: EnumPaymentMethod

    active: boolean

}