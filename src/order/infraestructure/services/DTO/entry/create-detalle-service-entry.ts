import { ApplicationServiceEntryDto } from "src/common/application/application-services/DTO/application-service-entry.dto";

export interface CreateDetalleServiceEntry extends ApplicationServiceEntryDto{

    id_orden: string

    detalle_productos: {
        id_producto: string,
        cantidad: number,
        precio?: number
    }[]

    detalle_combos: {
        id_combo: string,
        cantidad: number,
        precio?: number
    }[]

}