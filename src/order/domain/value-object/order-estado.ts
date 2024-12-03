import { IValueObject } from "src/common/domain/value-object/value-object.interface"
import { EnumOrderEstados } from "../enum/order-estados-enum"

export class OrderEstado implements IValueObject<OrderEstado>{

    protected constructor(
        private readonly estado: EnumOrderEstados
    ){
        this.estado = estado
    }

    get Estado(): EnumOrderEstados{
        return this.estado
    }

    equals(valueObject: OrderEstado): boolean {
        return this.estado === valueObject.Estado
    }

    static create(role: EnumOrderEstados): OrderEstado{
        return new OrderEstado(role)
    }

}