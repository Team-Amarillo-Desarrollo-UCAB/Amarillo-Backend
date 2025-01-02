import { DataSource, Repository } from "typeorm"
import { OrmNotificationAlertEntity } from "../entites/orm-notification-alert.entity"
import { Result } from "src/common/domain/result-handler/Result"
import { PaginationDto } from "src/common/infraestructure/dto/entry/pagination.dto"
import { INotificationAlertRepository } from "../interface/notification-alert-repository.interface"

export class OrmNotificationAlertRepository extends Repository<OrmNotificationAlertEntity> implements INotificationAlertRepository {

    private readonly notification: OrmNotificationAlertEntity

    constructor(datasource: DataSource) {
        super(OrmNotificationAlertEntity, datasource.createEntityManager())
    }

    async deleteNotificationById(alert_id: string): Promise<Result<boolean>> {
        try {
            const result = await this.delete({alert_id: alert_id})

            return Result.success<boolean>(true, 200)
        } catch (error) {
            return Result.fail<boolean>(error, 500, "Error al eliminar notificacion")
        }
    }

    async deleteNotificationsByUser(user_id: string): Promise<Result<string>> {
        try {
            const result = await
                this.createQueryBuilder()
                    .delete()
                    .from(OrmNotificationAlertEntity)
                    .where("user_id = :value", { value: user_id })
                    .execute();

            return Result.success<string>("Notificaciones eliminadas", 200)
        } catch (error) {
            return Result.fail<string>(error, 500, "Error al eliminar notificaciones")
        }
    }

    async findManyNotificationsByIdUser(userId: string, pagDto: PaginationDto): Promise<Result<OrmNotificationAlertEntity[]>> {
        try {
            const { page, perPage } = { page: pagDto.page, perPage: pagDto.page }
            const result = await
                this.createQueryBuilder()
                    .where("user_id = :value", { value: userId })
                    .skip(page)
                    .limit(perPage)
                    .getMany()

            return Result.success<OrmNotificationAlertEntity[]>(result, 200)
        } catch (error) {
            return Result.fail<OrmNotificationAlertEntity[]>(error, 500, "Error buscando Notificaciones")
        }
    }

    async saveNotificationAlert(alert: OrmNotificationAlertEntity): Promise<Result<OrmNotificationAlertEntity>> {

        try {
            const result = await this.save(alert)

            return Result.success<OrmNotificationAlertEntity>(result, 200)
        } catch (error) {
            return Result.fail<OrmNotificationAlertEntity>(error, 500, "Error en el guardado de la notificacion")
        }

    }

    async findNotificationById(user_id: string, notification_id: string): Promise<Result<OrmNotificationAlertEntity>> {
        try {
            const noti = await this.findOneBy({ "user_id": user_id, "alert_id": notification_id })

            return Result.success<OrmNotificationAlertEntity>(noti, 200)
        } catch (error) {
            return Result.fail<OrmNotificationAlertEntity>(error, 500, "Error buscando Notificacion")
        }
    }

    async findAllByIdUserNotReaded(user_id: string): Promise<Result<OrmNotificationAlertEntity[]>> {
        try {
            const result = await
                this.createQueryBuilder()
                    .where("user_id = :value", { value: user_id })
                    .andWhere("user_readed = :value", { value: false })
                    .getMany()
            return Result.success<OrmNotificationAlertEntity[]>(result, 200)
        } catch (error) {
            return Result.fail<OrmNotificationAlertEntity[]>(error, 500, "Error buscando Notificaciones")
        }
    }

}