import { Result } from "src/common/domain/result-handler/Result"
import { IApplicationService } from "../../application-service.interface"
import { ApplicationServiceEntryDto } from "../../DTO/application-service-entry.dto"
import { ApplicationServiceDecorator } from "../application-service.decorator"
import { IExceptionHandler } from './../../../exception-handler/exception-handler.interface';

export class ExceptionDecorator<D extends ApplicationServiceEntryDto, R> extends ApplicationServiceDecorator<D, R> implements IApplicationService<D, R> {

    private readonly exceptionHandler: IExceptionHandler

    constructor(applicationService: ApplicationServiceDecorator<D, R>, exceptionHandler: IExceptionHandler) {
        super(applicationService)
        this.exceptionHandler = exceptionHandler
    }

    async execute(data: D): Promise<Result<R>> {
        try {
            const result = await this.applicationService.execute(data)
            if (result.isSuccess())
                return result
            this.exceptionHandler.HandleException(result.StatusCode, result.Message, result.Error)
        } catch (error) {
            this.exceptionHandler.HandleException(error.status, error.message, error)
        }
    }

}