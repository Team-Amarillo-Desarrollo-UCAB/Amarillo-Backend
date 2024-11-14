import { ApplicationServiceEntryDto } from "src/common/application/application-services/DTO/application-service-entry.dto";

export interface CreateDetalleServiceEntry extends ApplicationServiceEntryDto{

    id_orden: string

    detalle_info: {
        id_detalle: string
        id_producto: string
        cantidad: number
    }[]

}