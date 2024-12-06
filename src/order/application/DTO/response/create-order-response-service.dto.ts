import { EnumOrderEstados } from "src/order/domain/enum/order-estados-enum"

export interface CreateOrderResponseServiceDTO{

    id_orden: string

    detalle_info: {
        id_detalle: string
        id_producto: string
        cantidad: number
    }[]

    fecha_creacion: Date
    
    estado: EnumOrderEstados

}