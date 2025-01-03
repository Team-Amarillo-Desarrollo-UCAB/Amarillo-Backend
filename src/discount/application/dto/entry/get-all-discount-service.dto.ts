import { ApplicationServiceEntryDto } from "src/common/application/application-services/DTO/application-service-entry.dto";

export interface GetAllDiscountServiceEntryDTO extends ApplicationServiceEntryDto{
    perpage?: number
    page?: number 
}