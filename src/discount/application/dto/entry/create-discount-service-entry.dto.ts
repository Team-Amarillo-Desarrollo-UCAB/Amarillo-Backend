import { ApplicationServiceEntryDto } from "src/common/application/application-services/dto/application-service-entry.dto";

export interface CreateDiscountServiceEntryDto extends ApplicationServiceEntryDto{
    name: string;
    description: string;
    percentage: number;
    startDate: Date;
    deadline: Date;
    image?: string;
}