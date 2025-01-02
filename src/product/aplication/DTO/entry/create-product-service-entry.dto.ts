import { ApplicationServiceEntryDto } from "src/common/application/application-services/DTO/application-service-entry.dto"
import { UnidadMedida } from "src/product/domain/enum/UnidadMedida"

export interface CreateProductServiceEntryDTO extends ApplicationServiceEntryDto {

    name: string

    description: string

    price: number

    currency: string

    weight: number

    measurement: UnidadMedida

    stock: number

    images?: string[],

    category?: {id: string}[]

    caducityDate?:Date

    discount?:string;

}