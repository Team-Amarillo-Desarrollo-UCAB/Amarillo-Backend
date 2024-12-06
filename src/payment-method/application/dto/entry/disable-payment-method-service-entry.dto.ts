import { ApplicationServiceEntryDto } from "src/common/application/application-services/dto/application-service-entry.dto";

export interface DisablePaymentMethodServiceEntryDTO extends ApplicationServiceEntryDto{

    id_payment_method: string

}