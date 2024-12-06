import { ApplicationServiceEntryDto } from "src/common/application/application-services/dto/application-service-entry.dto";

export interface GetBundleByIdServiceEntryDTO extends ApplicationServiceEntryDto{
    id_bundle: string
}