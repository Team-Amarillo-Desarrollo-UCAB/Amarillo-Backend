import { ApplicationServiceEntryDto } from "src/common/application/application-services/dto/application-service-entry.dto";

export interface GetCategoryByNameServiceEntryDTO extends ApplicationServiceEntryDto{
    name: string
}