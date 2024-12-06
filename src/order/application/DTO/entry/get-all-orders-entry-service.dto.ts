import { ApplicationServiceEntryDto } from "src/common/application/application-services/dto/application-service-entry.dto";

export interface GetAllOrdersServiceEntryDTO extends ApplicationServiceEntryDto{

    page: number

    limit: number

}