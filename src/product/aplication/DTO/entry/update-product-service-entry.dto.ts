import { ApplicationServiceEntryDto } from "src/common/application/application-services/dto/application-service-entry.dto";

export interface UpdateProductServiceEntryDTO extends ApplicationServiceEntryDto {

    id_producto: string
    name?: string
    description?: string
    images?: string[]
    price?: number
    currency?: string
    weight?: number
    measurement?: string
    stock?: number
    category?: [
        {
            id: string
        }
    ]

}