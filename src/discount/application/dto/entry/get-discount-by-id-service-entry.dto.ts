import { ApplicationServiceEntryDto } from "src/common/application/application-services/dto/application-service-entry.dto";

export interface GetDiscountByIdServiceEntryDto extends ApplicationServiceEntryDto{
    id_discount: string
}