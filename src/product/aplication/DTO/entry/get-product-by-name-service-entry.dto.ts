import { ApplicationServiceEntryDto } from "src/common/application/application-services/DTO/application-service-entry.dto";

export interface GetProductByNameServiceEntryDTO extends ApplicationServiceEntryDto{
    name: string
}