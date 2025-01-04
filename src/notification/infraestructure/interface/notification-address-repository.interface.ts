import { Result } from "src/common/domain/result-handler/Result"
import { OrmNotificationAdressEntity } from '../entites/orm-notification-adress.entity';

export interface INotificationAddressRepository {
    findTokenByIdUser(userId: string): Promise<Result<OrmNotificationAdressEntity>>
    saveNotificationAddress(noti_address: OrmNotificationAdressEntity): Promise<Result<OrmNotificationAdressEntity>>
    findAllTokens(): Promise<Result<OrmNotificationAdressEntity[]>>

}