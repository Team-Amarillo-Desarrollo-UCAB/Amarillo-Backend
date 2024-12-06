import { ApplicationServiceEntryDto } from "src/common/application/application-services/dto/application-service-entry.dto";

export interface GetAllCuponServiceEntryDTO extends ApplicationServiceEntryDto{
    limit?: number
    page?: number 
}