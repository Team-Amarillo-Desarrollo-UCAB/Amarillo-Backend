import { IApplicationService } from "src/common/application/application-services/application-service.interface";
import { CreateReportServiceResponseDTO } from "../../DTO/response/create-report-response-service-response.dto";
import { CreateReportServiceEntryDTO } from "../../DTO/entry/create-report-service-entry.dto";
import { Result } from "src/common/domain/result-handler/Result";
import { IOrderRepository } from "src/order/domain/repositories/order-repository.interface";
import { IdGenerator } from "src/common/application/id-generator/id-generator.interface";
import { OrderReport } from "src/order/domain/entites/order-report";
import { OrderReportText } from "src/order/domain/value-object/order-report/order-report-text";
import { OrderReportId } from "src/order/domain/value-object/order-report/order-report-id";
import { EnumOrderEstados } from "@src/order/domain/enum/order-estados-enum";

export class CreateReportService implements
    IApplicationService<CreateReportServiceEntryDTO, CreateReportServiceResponseDTO> {

    private readonly orderRepository: IOrderRepository
    private readonly idGenerator: IdGenerator<string>

    constructor(orderRepository: IOrderRepository,idGenerator: IdGenerator<string>) {
        this.orderRepository = orderRepository
        this.idGenerator = idGenerator
    }

    async execute(data: CreateReportServiceEntryDTO): Promise<Result<CreateReportServiceResponseDTO>> {

        const find_orden = await this.orderRepository.findOrderById(data.id_orden)
        if (!find_orden.isSuccess())
            return Result.fail(new Error("Orden no encontrada"), find_orden.StatusCode, "Orden no encontrada")

        const orden = find_orden.Value

        if(orden.Estado.Estado != EnumOrderEstados.CANCELLED &&
            orden.Estado.Estado != EnumOrderEstados.DELIVERED &&
            orden.Estado.Estado != EnumOrderEstados.CANCELED
        )
            return Result.fail(new Error("No es posible reportar la orden"), find_orden.StatusCode, "No es posible reportar la orden")

        const reporte = OrderReport.create(
            OrderReportId.create(await this.idGenerator.generateId()),
            OrderReportText.create(data.texto)
        )

        const save_report = await this.orderRepository.saveReport(find_orden.Value,reporte)
        if(!save_report.isSuccess())
            return Result.fail<CreateReportServiceResponseDTO>(save_report.Error,save_report.StatusCode,save_report.Message)

        const response: CreateReportServiceResponseDTO = {
            id_orden: find_orden.Value.Id.Id,
            id_reporte: reporte.Id.Id
        }

        return Result.success<CreateReportServiceResponseDTO>(response,200)
    }

    get name(): string {
        return this.constructor.name
    }

}