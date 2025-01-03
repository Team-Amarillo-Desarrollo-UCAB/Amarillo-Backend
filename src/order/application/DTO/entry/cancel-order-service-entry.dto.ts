import { ApplicationServiceEntryDto } from "src/common/application/application-services/DTO/application-service-entry.dto";

export interface CancelOrderServiceEntryDTO extends ApplicationServiceEntryDto{
    order_id: string
}