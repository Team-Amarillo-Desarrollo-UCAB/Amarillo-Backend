import { Result } from "src/common/domain/result-handler/Result"
import { IApplicationService } from "../../application-service.interface"
import { ApplicationServiceDecorator } from "../application-service.decorator"
import { ILogger } from "src/common/application/logger/logger.interface"
import { LoggerDto } from "src/common/application/logger/dto/logs.dto"
import { ApplicationServiceEntryDto } from "../../DTO/application-service-entry.dto"


export class PerformanceDecorator<D extends ApplicationServiceEntryDto, R> extends ApplicationServiceDecorator<D, R> implements IApplicationService<D, R> {

    private readonly logger: ILogger

    constructor(applicationService: IApplicationService<D, R>, logger: ILogger) {
        super(applicationService)
        this.logger = logger
    }

    async execute(data: D): Promise<Result<R>> {
        const start = new Date().getTime()
        const result = await super.execute(data)
        const toLog: LoggerDto = {
            userId: data.userId,
            data: `Execution time: ${new Date().getTime() - start} ms`,
            name: this.name
        }
        if (result.isSuccess())
            this.logger.SuccessLog(toLog)
        else
            this.logger.FailLog(toLog)
        return result
    }

}