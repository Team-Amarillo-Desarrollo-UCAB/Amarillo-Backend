import { ApplicationServiceEntryDto } from "src/common/application/application-services/DTO/application-service-entry.dto";

export interface NotifyBundlesByNamesServiceEntryDTO extends ApplicationServiceEntryDto{

    bundles_names: string[];

}