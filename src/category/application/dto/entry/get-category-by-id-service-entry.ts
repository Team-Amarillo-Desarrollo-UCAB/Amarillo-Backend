import { ApplicationServiceEntryDto } from "src/common/application/application-services/dto/application-service-entry.dto";

export interface GetCategoryByIdServiceEntryDTO extends ApplicationServiceEntryDto{
    id_category: string
}