import { IApplicationService } from "src/common/application/application-services/application-service.interface"
import { Result } from "src/common/domain/result-handler/Result"
import { GetCountNotReadedResponseDTO } from "../dto/response/get-count-not-readed-response"
import { INotificationAlertRepository } from "../../interface/notification-alert-repository.interface"
import { ApplicationServiceEntryDto } from "src/common/application/application-services/DTO/application-service-entry.dto"

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