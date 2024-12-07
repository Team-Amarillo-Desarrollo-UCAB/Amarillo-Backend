import { EnumOrderEstados } from "src/order/domain/enum/order-estados-enum"

export interface GetAllOrdersServiceResponseDTO {

    id_orden: string

    estado: EnumOrderEstados

    productos:
    {
        id_producto: string
        nombre_producto: string
        cantidad_producto: number
    }[]

    combos:
    {
        id_combo: string;
        nombre_combo: string;
        cantidad_combo: number
    }[]

    monto_total: number

    fecha_creacion: Date

}