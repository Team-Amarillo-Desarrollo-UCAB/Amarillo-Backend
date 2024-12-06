import { ApplicationServiceEntryDto } from "src/common/application/application-services/DTO/application-service-entry.dto"
import { PaginationDto } from "src/common/infraestructure/dto/entry/pagination.dto"




export interface GetUserProfileServiceEntryDto extends ApplicationServiceEntryDto {

    pagination: PaginationDto

}