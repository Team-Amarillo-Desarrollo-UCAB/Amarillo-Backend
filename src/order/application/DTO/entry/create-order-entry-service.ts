import { ApplicationServiceEntryDto } from "src/common/application/application-services/DTO/application-service-entry.dto";

export interface CreateOrderEntryServiceDTO extends ApplicationServiceEntryDto {

    orderReciviedDate?: string

    address: string

    latitude: number

    longitude: number

    products?: {
        id: string;
        quantity: number;
    }[]

    bundles?: {
        id: string
        quantity: number
    }[]

    cupon_code?: string

    instructions?: string

}