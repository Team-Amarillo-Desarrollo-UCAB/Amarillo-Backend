import { ApplicationServiceEntryDto } from "src/common/application/application-services/dto/application-service-entry.dto";

export interface DeleteProductServiceEntryDTO extends ApplicationServiceEntryDto{
    id_product: string
}