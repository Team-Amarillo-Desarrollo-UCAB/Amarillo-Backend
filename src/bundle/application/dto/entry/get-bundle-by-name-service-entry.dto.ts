import { ApplicationServiceEntryDto } from "src/common/application/application-services/dto/application-service-entry.dto";

export interface GetBundleByNameServiceEntryDTO extends ApplicationServiceEntryDto{
    name: string
}