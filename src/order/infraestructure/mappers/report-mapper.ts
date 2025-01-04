import { IMapper } from "src/common/application/mappers/mapper.interface"
import { OrderReport } from "src/order/domain/entites/order-report"
import { OrmReport } from "../entites/order-report.entity"
import { OrderReportId } from "src/order/domain/value-object/order-report/order-report-id"
import { OrderReportText } from "src/order/domain/value-object/order-report/order-report-text"

export class ReportMapper implements IMapper<OrderReport, OrmReport> {

    async fromDomainToPersistence(domain: OrderReport): Promise<OrmReport> {

        const reporte = OrmReport.create(
            domain.Id.Id,
            domain.Texto().Texto
        )

        return reporte
    }

    async fromPersistenceToDomain(persistence: OrmReport): Promise<OrderReport> {

        const reporte = OrderReport.create(
            OrderReportId.create(persistence.id),
            OrderReportText.create(persistence.texto)
        )

        return reporte

    }

}