import { IApplicationService } from "src/common/Application/application-services/application-service.interface"
import { ApplicationServiceEntryDto } from "src/common/Application/application-services/dto/application-service-entry.dto"
import { Result } from "src/common/Domain/result-handler/Result"
import { GetCountNotReadedResponseDTO } from "../dto/response/get-count-not-readed-response"
import { INotificationAlertRepository } from "../../interface/notification-alert-repository.interface"

export class GetNumberNotificationNotReadedByUserInfraService implements
    IApplicationService<ApplicationServiceEntryDto, GetCountNotReadedResponseDTO> {
    private readonly notiAlertRepository: INotificationAlertRepository

    constructor(
        notiAlertRepository: INotificationAlertRepository,
    ) {
        this.notiAlertRepository = notiAlertRepository
    }
    async execute(data: ApplicationServiceEntryDto): Promise<Result<GetCountNotReadedResponseDTO>> {
        const notiResult = await this.notiAlertRepository.findAllByIdUserNotReaded(data.userId)
        if (!notiResult.isSuccess())
            return Result.fail(notiResult.Error, notiResult.StatusCode, notiResult.Message);
        let response = { count: notiResult.Value.length }
        return Result.success(response, 200)
    }
    get name(): string { return this.constructor.name }

}