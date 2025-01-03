import { ApplicationServiceEntryDto } from "src/common/application/application-services/DTO/application-service-entry.dto";

export class GetNotificationsUserServiceEntryDto implements ApplicationServiceEntryDto {
    userId: string;
    page: number
    perPage: number
}