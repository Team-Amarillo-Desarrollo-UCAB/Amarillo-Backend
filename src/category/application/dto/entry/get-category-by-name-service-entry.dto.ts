import { ApplicationServiceEntryDto } from "src/common/application/application-services/DTO/application-service-entry.dto";

export interface GetCategoryByNameServiceEntryDTO extends ApplicationServiceEntryDto{
    name: string
}