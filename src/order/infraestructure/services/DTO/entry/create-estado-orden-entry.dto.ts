import { ApplicationServiceEntryDto } from "src/common/application/application-services/dto/application-service-entry.dto"
import { EnumOrderEstados } from "src/order/domain/enum/order-estados-enum"

export interface CreateEstadoOrdenServiceEntry extends ApplicationServiceEntryDto{

    id_orden: string

    fecha_inicio: Date

    estado: EnumOrderEstados

    fecha_fin?: Date

}