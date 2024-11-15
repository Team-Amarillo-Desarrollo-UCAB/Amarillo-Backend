import { EnumOrderEstados } from "src/order/domain/order-estados-enum";

export class GetOrderByIdResponseServiceDTO {

    id_orden: string;

    detalle: {
        id_producto: string;
        cantidad_producto: number;
    }[];

    monto_total: number

    fecha_creacion: Date

    estado: EnumOrderEstados
}