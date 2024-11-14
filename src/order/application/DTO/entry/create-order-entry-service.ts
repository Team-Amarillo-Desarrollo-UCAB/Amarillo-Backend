import { ApplicationServiceEntryDto } from "src/common/application/application-services/DTO/application-service-entry.dto";

export interface CreateOrderEntryServiceDTO extends ApplicationServiceEntryDto {

    entry: {
        id_producto: string;
        nombre_producto: string;
        cantidad_producto: number;
    }[]

}