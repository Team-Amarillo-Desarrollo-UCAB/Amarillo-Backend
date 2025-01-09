import { ApplicationServiceEntryDto } from "src/common/application/application-services/DTO/application-service-entry.dto";

export interface UpdateOrderInformationServiceEntryDTO extends ApplicationServiceEntryDto{

    id_orden: string

    latitud?: number

    longitud?: number

    direccion?: string

    orderReciviedDate?: string

}