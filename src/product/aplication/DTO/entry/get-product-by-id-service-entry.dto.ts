import { ApplicationServiceEntryDto } from "src/common/application/application-services/DTO/application-service-entry.dto";

export interface GetProductByIdServiceEntryDTO extends ApplicationServiceEntryDto{
    id_product: string
}