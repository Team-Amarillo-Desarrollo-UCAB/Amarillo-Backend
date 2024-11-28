import { ApplicationServiceEntryDto } from "src/common/application/application-services/DTO/application-service-entry.dto"

export interface FindUserByEmailEntryDTO extends ApplicationServiceEntryDto{
    email: string
}