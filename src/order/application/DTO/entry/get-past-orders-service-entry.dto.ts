import { ApplicationServiceEntryDto } from "src/common/application/application-services/DTO/application-service-entry.dto";

export interface GetPastOrdersServiceEntryDTO extends ApplicationServiceEntryDto {

    //user_id: string
    page: number
    perPage: number
}