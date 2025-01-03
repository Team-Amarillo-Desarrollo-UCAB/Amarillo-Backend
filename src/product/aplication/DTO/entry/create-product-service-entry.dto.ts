import { ApplicationServiceEntryDto } from "src/common/application/application-services/DTO/application-service-entry.dto"
import { Moneda } from "src/product/domain/enum/Monedas"
import { UnidadMedida } from "src/product/domain/enum/UnidadMedida"


export interface CreateProductServiceEntryDTO extends ApplicationServiceEntryDto {

    name: string

    description: string

    images?: string[]

    price: number

    currency: Moneda

    weight: number

    measurement: UnidadMedida

    stock: number

    category?: string[]

    caducityDate?: Date

    discount?: string;

}