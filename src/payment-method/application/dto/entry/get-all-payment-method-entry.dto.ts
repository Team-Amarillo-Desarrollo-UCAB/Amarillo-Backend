import { ApplicationServiceEntryDto } from "src/common/application/application-services/DTO/application-service-entry.dto"

export interface GetAllPaymentMethodServiceEntryDTO extends ApplicationServiceEntryDto {

    page: number

    limit: number

}