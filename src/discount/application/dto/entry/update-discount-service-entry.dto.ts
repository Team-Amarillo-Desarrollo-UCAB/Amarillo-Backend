import { ApplicationServiceEntryDto } from "src/common/application/application-services/DTO/application-service-entry.dto";

export interface UpdateDiscountServiceEntryDto extends ApplicationServiceEntryDto{
    id:string;
    name?: string;
    description?: string;
    percentage?: number;
    startDate?: Date;
    deadline?: Date;
    image?: string;
}