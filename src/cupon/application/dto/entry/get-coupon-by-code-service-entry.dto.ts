import { ApplicationServiceEntryDto } from "src/common/application/application-services/DTO/application-service-entry.dto";

export class GetCouponByCodeServiceEntryDTO implements ApplicationServiceEntryDto{
    userId: string;
    cuponCode: string
}