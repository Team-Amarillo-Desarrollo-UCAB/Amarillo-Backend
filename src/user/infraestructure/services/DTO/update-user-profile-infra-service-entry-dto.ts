import { ApplicationServiceEntryDto } from "src/common/application/application-services/dto/application-service-entry.dto";

export interface UpdateUserProfileInfraServiceEntryDto extends ApplicationServiceEntryDto {

    userId: string;
    password?: string;
    image?: string;

}