import { ApplicationServiceEntryDto } from "src/common/application/application-services/DTO/application-service-entry.dto";

export interface UpdateUserProfileInfraServiceEntryDto extends ApplicationServiceEntryDto {

    userId: string;
    password?: string;
    image?: File

}