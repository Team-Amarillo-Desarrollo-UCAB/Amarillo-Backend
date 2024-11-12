import { UnidadMedida } from "src/product/domain/enum/UnidadMedida"

export interface CreateProductServiceResponseDTO{

    id_producto: string

    nombre: string

    descripcion: string

    unidad_medida: UnidadMedida

    cantidad_medida: number

    precio: number
    
    moneda: string

    stock: number

    imagen?: string


}