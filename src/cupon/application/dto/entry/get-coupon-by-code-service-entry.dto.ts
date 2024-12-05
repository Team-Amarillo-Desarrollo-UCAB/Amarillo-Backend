import { ApplicationServiceEntryDto } from "src/common/application/application-services/dto/application-service-entry.dto";

export class GetCouponByCodeServiceEntryDTO implements ApplicationServiceEntryDto{
    userId: string;
    cuponCode: string
}