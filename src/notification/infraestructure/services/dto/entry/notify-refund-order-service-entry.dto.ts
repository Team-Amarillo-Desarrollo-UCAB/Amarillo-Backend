import { ApplicationServiceEntryDto } from "src/common/application/application-services/DTO/application-service-entry.dto"

export interface NotifyRefundOrderServiceEntryDTO extends ApplicationServiceEntryDto{

    id_orden: string

    monto_reembolsado: number

}