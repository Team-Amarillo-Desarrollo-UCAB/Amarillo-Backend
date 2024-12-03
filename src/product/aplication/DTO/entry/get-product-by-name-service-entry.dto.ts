import { ApplicationServiceEntryDto } from "src/common/application/application-services/dto/application-service-entry.dto";

export interface GetProductByNameServiceEntryDTO extends ApplicationServiceEntryDto{
    name: string
}