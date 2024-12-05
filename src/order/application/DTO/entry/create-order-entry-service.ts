import { ApplicationServiceEntryDto } from "src/common/application/application-services/dto/application-service-entry.dto";

export interface CreateOrderEntryServiceDTO extends ApplicationServiceEntryDto {

    products: {
        id: string;
        quantity: number;
    }[]

}