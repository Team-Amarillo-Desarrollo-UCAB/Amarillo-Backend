import { ApplicationServiceEntryDto } from "src/common/Application/application-services/dto/application-service-entry.dto";

export class SaveTokenAddressServiceEntryDto implements ApplicationServiceEntryDto {
    userId: string
    token: string
}