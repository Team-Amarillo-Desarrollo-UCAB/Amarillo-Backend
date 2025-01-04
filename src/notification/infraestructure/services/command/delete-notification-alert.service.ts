import { IApplicationService } from "src/common/application/application-services/application-service.interface";
import { Result } from "src/common/domain/result-handler/Result";
import { INotificationAlertRepository } from "../../interface/notification-alert-repository.interface";
import { ApplicationServiceEntryDto } from "src/common/application/application-services/DTO/application-service-entry.dto";

export class DeleteNotificationsInfraService implements IApplicationService<ApplicationServiceEntryDto, any> {
    private readonly notiAlertRepository: INotificationAlertRepository
    constructor(
        notiAlertRepository: INotificationAlertRepository,
    ) {
        this.notiAlertRepository = notiAlertRepository
    }

    async execute(notifyDto: ApplicationServiceEntryDto): Promise<Result<any>> {
        this.notiAlertRepository.deleteNotificationsByUser(notifyDto.userId)
        return Result.success('delete notifications', 200)
    }

    get name(): string { return this.constructor.name }
}