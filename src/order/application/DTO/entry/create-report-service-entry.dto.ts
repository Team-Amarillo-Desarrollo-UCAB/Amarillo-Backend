import { ApplicationServiceEntryDto } from "src/common/application/application-services/DTO/application-service-entry.dto";

export interface CreateReportServiceEntryDTO extends ApplicationServiceEntryDto{

    id_orden: string

    texto: string

}