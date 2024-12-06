import { ApplicationServiceEntryDto } from "src/common/application/application-services/DTO/application-service-entry.dto"


export class LogInUserServiceEntryDto implements ApplicationServiceEntryDto {
    userId: string
    email: string
    password: string
}