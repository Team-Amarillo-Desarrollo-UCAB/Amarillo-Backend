import { ApplicationServiceEntryDto } from "src/common/application/application-services/DTO/application-service-entry.dto";

export class GetCuponByUserServiceEntryDTO implements ApplicationServiceEntryDto{
    userId: string;
}