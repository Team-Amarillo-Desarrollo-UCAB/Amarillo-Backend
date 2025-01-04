import { DomainEvent } from "src/common/domain/domain-event/domain-event.interface";

export class OrderReportCreated extends DomainEvent {
    protected constructor(
        public id: string,
        public id_reporte: string,
        public texto: string
    ) {
        super();
    }

    public static create(
        id: string,
        id_reporte: string,
        texto: string
    ): OrderReportCreated {
        return new OrderReportCreated(
            id,
            id_reporte,
            texto
        );
    }
}