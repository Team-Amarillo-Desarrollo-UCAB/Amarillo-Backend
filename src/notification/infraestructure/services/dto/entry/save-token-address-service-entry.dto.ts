import { ApplicationServiceEntryDto } from "src/common/application/application-services/DTO/application-service-entry.dto"

export class SaveTokenAddressServiceEntryDto implements ApplicationServiceEntryDto {
    userId: string
    token: string
}