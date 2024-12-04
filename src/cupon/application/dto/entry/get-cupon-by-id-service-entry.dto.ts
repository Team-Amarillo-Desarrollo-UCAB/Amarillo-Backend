import { ApplicationServiceEntryDto } from "src/common/application/application-services/dto/application-service-entry.dto";

export class GetCuponByIdServiceEntryDTO implements ApplicationServiceEntryDto{
    userId: string;
    cuponId: string
}