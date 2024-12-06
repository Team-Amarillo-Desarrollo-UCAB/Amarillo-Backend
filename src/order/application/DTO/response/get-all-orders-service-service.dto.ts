import { EnumOrderEstados } from "src/order/domain/enum/order-estados-enum"
import * as nodemailer from 'nodemailer';

export interface GetAllOrdersServiceResponseDTO {

    id_orden: string

    estado: EnumOrderEstados

    productos:
    {
        id_producto: string
        nombre_producto: string
        cantidad_producto: number
    }[]

    monto_total: number

    fecha_creacion: Date

}