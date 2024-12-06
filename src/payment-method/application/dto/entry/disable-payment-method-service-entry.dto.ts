import { ApplicationServiceEntryDto } from "src/common/application/application-services/DTO/application-service-entry.dto";

export interface DisablePaymentMethodServiceEntryDTO extends ApplicationServiceEntryDto{

    id_payment_method: string

}