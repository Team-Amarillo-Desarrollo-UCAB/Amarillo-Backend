import { ApplicationServiceEntryDto } from "src/common/application/application-services/DTO/application-service-entry.dto";

export class CreateCuponServiceEntryDto implements ApplicationServiceEntryDto {
    userId: string
    code: string
    expiration_date: Date
    amount: number
}