import { ApplicationServiceEntryDto } from "src/common/application/application-services/DTO/application-service-entry.dto";

export interface CreateHistoricoPrecioServiceEntryDTO extends ApplicationServiceEntryDto{
 
    id_producto: string

    precio: number

    moneda: string
    
}