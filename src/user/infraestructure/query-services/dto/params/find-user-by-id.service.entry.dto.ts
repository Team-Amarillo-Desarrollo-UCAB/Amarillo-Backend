import { ApplicationServiceEntryDto } from "src/common/Application/application-services/dto/application-service-entry.dto";

export interface FindUserByIdEntryDTO extends ApplicationServiceEntryDto{
   userId: string;
    
}