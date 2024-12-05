import { ApplicationServiceEntryDto } from "src/common/application/application-services/dto/application-service-entry.dto";


export interface GetAllCategoriesServiceEntryDTO extends ApplicationServiceEntryDto{

    limit?: number
    page?: number
    categoryName?:string
    discount?:string 


}