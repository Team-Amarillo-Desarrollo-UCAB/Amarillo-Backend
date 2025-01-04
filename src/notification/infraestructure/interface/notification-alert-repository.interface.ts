import { Result } from "src/common/domain/result-handler/Result"
import { OrmNotificationAlertEntity } from '../entites/orm-notification-alert.entity';
import { PaginationDto } from "src/common/infraestructure/dto/entry/pagination.dto";

export interface INotificationAlertRepository {
    findManyNotificationsByIdUser(userId: string, pagDto: PaginationDto): Promise<Result<OrmNotificationAlertEntity[]>>
    saveNotificationAlert(alert: OrmNotificationAlertEntity): Promise<Result<OrmNotificationAlertEntity>>
    findNotificationById(user_id: string, notification_id: string): Promise<Result<OrmNotificationAlertEntity>>
    deleteNotificationsByUser(user_id: string): void
    deleteNotificationById(alert_id: string): Promise<Result<boolean>>
    findAllByIdUserNotReaded(user_id: string): Promise<Result<OrmNotificationAlertEntity[]>>
}