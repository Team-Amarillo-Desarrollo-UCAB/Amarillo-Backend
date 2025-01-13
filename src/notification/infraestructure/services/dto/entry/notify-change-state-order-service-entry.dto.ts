import { ApplicationServiceEntryDto } from "src/common/application/application-services/DTO/application-service-entry.dto";
import { EnumOrderEstados } from "src/order/domain/enum/order-estados-enum";

export interface NotifyChangeStateOrderServiceEntryDTO extends ApplicationServiceEntryDto{

    id_orden: string

    estado: EnumOrderEstados

}