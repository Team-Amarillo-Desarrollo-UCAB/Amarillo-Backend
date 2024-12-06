import { ApplicationServiceEntryDto } from "src/common/application/application-services/DTO/application-service-entry.dto"
import { UnidadMedida } from "src/product/domain/enum/UnidadMedida"

export interface CreateProductServiceEntryDTO extends ApplicationServiceEntryDto {

    nombre: string

    descripcion: string

    unidad_medida: UnidadMedida

    cantidad_medida: number

    precio: number

    moneda: string

    stock: number

    category: [
        {
            id: string
        }
    ]

    image?: string

}