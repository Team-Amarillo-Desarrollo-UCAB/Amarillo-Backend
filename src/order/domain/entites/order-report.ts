import { Entity } from "src/common/domain/entity/entity";
import { OrderTotal } from "../value-object/order-total";
import { OrderReportId } from "../value-object/order-report/order-report-id";
import { OrderReportText } from "../value-object/order-report/order-report-text";

export class OrderReport extends Entity<OrderReportId> {

    protected constructor(
        id: OrderReportId,
        private readonly texto: OrderReportText
    ) {
        super(id)
        this.texto = texto
    }

    Texto() {
        return this.texto
    }

    static create(
        id: OrderReportId,
        texto: OrderReportText
    ): OrderReport {
        return new OrderReport(id, texto)
    }

}