import { ApplicationServiceEntryDto } from "src/common/application/application-services/dto/application-service-entry.dto";


export interface GetAllBundlesServiceEntryDTO extends ApplicationServiceEntryDto{

    perpage?: number
    page?: number
    category?:string[];
    name?:string; 
    price?:number; 
    popular?:string;
    discount?:string;


}