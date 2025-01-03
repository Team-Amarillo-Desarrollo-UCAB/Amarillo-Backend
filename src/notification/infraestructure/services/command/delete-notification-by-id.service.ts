import { IApplicationService } from "src/common/Application/application-services/application-service.interface";
import { Result } from "src/common/Domain/result-handler/Result";
import { INotificationAlertRepository } from "../../interface/notification-alert-repository.interface";
import { DeleteNotificationAlertByIdServiceEntryDto } from "../dto/entry/delete-notification-alert-service.dto";

export class DeleteNotificationsInfraService implements IApplicationService<DeleteNotificationAlertByIdServiceEntryDto, void> {
    private readonly notiAlertRepository: INotificationAlertRepository
    constructor(
        notiAlertRepository: INotificationAlertRepository,
    ) {
        this.notiAlertRepository = notiAlertRepository
    }

    async execute(data: DeleteNotificationAlertByIdServiceEntryDto): Promise<Result<void>> {
        const result = await this.notiAlertRepository.deleteNotificationById(data.alert_id)

        if(!result.isSuccess())
            return Result.fail(result.Error,result.StatusCode,result.Message)

        return Result.success<void>(null, 200)
    }

    get name(): string { return this.constructor.name }
}