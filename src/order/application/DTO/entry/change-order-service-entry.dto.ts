import { ApplicationServiceEntryDto } from "src/common/application/application-services/DTO/application-service-entry.dto";
import { EnumOrderEstados } from "src/order/domain/enum/order-estados-enum";

export interface ChangeOrderServiceEntryDTO extends ApplicationServiceEntryDto {

    id_order: string

    orderState: EnumOrderEstados

}