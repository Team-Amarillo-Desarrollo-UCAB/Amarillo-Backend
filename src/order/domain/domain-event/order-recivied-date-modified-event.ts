import { DomainEvent } from "src/common/domain/domain-event/domain-event.interface"

export class OrderReciviedDateModified extends DomainEvent {

    protected constructor(
        public id: string,
        public fecha_entrega: Date
    ) {
        super()

    }

    static create(id: string, fecha_entrega: Date){
        return new OrderReciviedDateModified(id,fecha_entrega)
    }

}