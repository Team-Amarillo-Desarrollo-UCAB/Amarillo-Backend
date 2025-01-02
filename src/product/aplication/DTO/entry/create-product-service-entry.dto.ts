import { ApplicationServiceEntryDto } from "src/common/application/application-services/DTO/application-service-entry.dto"
import { Moneda } from "src/product/domain/enum/Monedas"
import { UnidadMedida } from "src/product/domain/enum/UnidadMedida"

export interface CreateProductServiceEntryDTO extends ApplicationServiceEntryDto {

    nombre: string

    descripcion: string

    unidad_medida: UnidadMedida//MEASUREMENT

    cantidad_medida: number//WEIGHT

    precio: number

    moneda: Moneda

    stock: number

    category?: string[]

    images?: string[],

    caducityDate?:Date
    discount?:string;



}