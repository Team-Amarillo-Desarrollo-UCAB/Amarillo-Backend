import { DomainEvent } from "src/common/domain/domain-event/domain-event.interface"

export class OrderLocationDeliveryModified extends DomainEvent {

    protected constructor(
        public id: string,
        public longitud: Date,
        public latitud: Date,
        public ubicacion: string
    ) {
        super()
    }

    static create(
        id: string,
        longitud: Date,
        latitud: Date,
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