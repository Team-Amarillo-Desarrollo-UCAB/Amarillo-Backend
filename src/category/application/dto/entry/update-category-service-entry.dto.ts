import { ApplicationServiceEntryDto } from '../../../../common/application/application-services/dto/application-service-entry.dto';

export interface UpdateCategoryServiceEntryDto extends ApplicationServiceEntryDto{
    
    id:string,
    name?:string,
    icon?:string

}