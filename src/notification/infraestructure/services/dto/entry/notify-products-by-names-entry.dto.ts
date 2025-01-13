import { ApplicationServiceEntryDto } from "src/common/application/application-services/DTO/application-service-entry.dto";

export interface NotifyProductsByNamesServiceEntryDTO extends ApplicationServiceEntryDto{

    products_names: string[];

}