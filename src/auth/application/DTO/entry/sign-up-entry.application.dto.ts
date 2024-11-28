import { ApplicationServiceEntryDto } from "src/common/application/application-services/DTO/application-service-entry.dto"


export class SignUpEntryDto implements ApplicationServiceEntryDto {
    userId: string
    email: string
    name: string
    phone: string
}