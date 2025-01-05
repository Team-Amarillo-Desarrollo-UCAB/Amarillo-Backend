import { IValueObject } from "src/common/domain/value-object/value-object.interface"

export class OrderLocationDelivery implements IValueObject<OrderLocationDelivery> {

    protected constructor(
        private readonly direccion: string,
        private readonly longitud: number,
        private readonly latitud: number
    ) {

    }

    get Direccion() {
        return this.direccion
    }

    get Longitud() {
        return this.longitud
    }

    get Latitud() {
        return this.latitud
    }

    equals(valueObject: OrderLocationDelivery): boolean {
        return (this.longitud === valueObject.Longitud) &&
            (this.latitud === valueObject.Latitud) &&
            (this.direccion === valueObject.Direccion)
    }

    static create(
        direccion: string,
        longitud: number,
        latitud: number
    ): OrderLocationDelivery {
        return new OrderLocationDelivery(direccion, longitud, latitud)
    }

}