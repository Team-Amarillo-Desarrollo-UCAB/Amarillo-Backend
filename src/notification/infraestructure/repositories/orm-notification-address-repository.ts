import { DataSource, Repository } from "typeorm"
import { OrmNotificationAdressEntity } from "../entites/orm-notification-adress.entity"
import { Result } from '../../../common/domain/result-handler/Result';
import { INotificationAddressRepository } from "../interface/notification-address-repository.interface";

export class OrmNotificationAddressRepository extends Repository<OrmNotificationAdressEntity> implements
INotificationAddressRepository
{

    private readonly notification: OrmNotificationAdressEntity

    constructor(datasource: DataSource) {
        super(OrmNotificationAddressRepository, datasource.createEntityManager())
    }

    async findTokenByIdUser(userId: string): Promise<Result<OrmNotificationAdressEntity>> {
        try {
            const findNoti = await this.findOne({
                where: { user_id: userId }
            })
            return Result.success<OrmNotificationAdressEntity>(findNoti, 200)
        } catch (error) {
            return Result.fail<OrmNotificationAdressEntity>(error, 500, "Error buscando PushToken")
        }
    }

    async saveNotificationAddress(noti_address: OrmNotificationAdressEntity): Promise<Result<OrmNotificationAdressEntity>> {

        try {
            const findNoti = await this.findOne({
                where: { token: noti_address.token }
            })
            if (!findNoti) {
                await this.save(noti_address)
            } else {
                //findNoti.user_id = noti_address.user_id
                //await this.notiModel.create( findNoti )
            }
        } catch (error) {
            return Result.fail(error, 500, 'Token del dispositivo no pudo guardarse')
        }


    }

    async findAllTokens(): Promise<Result<OrmNotificationAdressEntity[]>> {
        try {
            const tokens = await this.find()
            return Result.success<OrmNotificationAdressEntity[]>(tokens, 200)
        } catch (error) {
            return Result.fail<OrmNotificationAdressEntity[]>(error, 500, "Error buscando PushToken")
        }
    }

}