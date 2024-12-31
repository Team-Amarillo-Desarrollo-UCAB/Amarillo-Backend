import { ApplicationServiceEntryDto } from "src/common/application/application-services/DTO/application-service-entry.dto";


export interface GetAllCategoriesServiceEntryDTO extends ApplicationServiceEntryDto{

    perpage?: number
    page?: number
    name?:string
    discount?:string 


}