import { ApplicationServiceEntryDto } from "src/common/application/application-services/dto/application-service-entry.dto";

export interface GetAllDiscountServiceEntryDTO extends ApplicationServiceEntryDto{
    limit?: number
    page?: number 
}