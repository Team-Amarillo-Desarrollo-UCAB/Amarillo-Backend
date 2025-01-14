import { DomainEvent } from "src/common/domain/domain-event/domain-event.interface"

export class OrderLocationDeliveryModified extends DomainEvent {

    protected constructor(
        public id: string,
        public longitud: number,
        public latitud: number,
        public ubicacion: string
    ) {
        super()
    }

    static create(
        id: string,
        longitud: number,
        latitud: number,
        ubicacion: string
    ) {
        return new OrderLocationDeliveryModified(
            id,
            longitud,
            latitud,
            ubicacion
        )
    }

}