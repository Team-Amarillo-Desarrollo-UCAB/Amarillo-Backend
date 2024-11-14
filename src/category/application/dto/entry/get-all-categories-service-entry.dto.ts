import { ApplicationServiceEntryDto } from "src/common/application/application-services/DTO/application-service-entry.dto";


export interface GetAllCategoriesServiceEntryDTO extends ApplicationServiceEntryDto{

    limit?: number
    page?: number 


}