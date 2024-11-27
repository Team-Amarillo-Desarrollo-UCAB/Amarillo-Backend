
import { ApplicationServiceEntryDto } from "src/common/Application/application-services/dto/application-service-entry.dto"

export interface UpdateUserProfileServiceEntryDto extends ApplicationServiceEntryDto {

    userId: string;
    name?: string;
    email? :string; 
    phone?: string;

}