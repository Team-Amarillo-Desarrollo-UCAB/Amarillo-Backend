import { User } from "src/user/domain/user"
import { OdmUserEntity } from "../../entities/odm-entities/odm-user.entity"
import { IMapper } from "src/common/application/mappers/mapper.interface"
import { UserEmail } from "src/user/domain/value-object/user-email"
import { UserId } from "src/user/domain/value-object/user-id"
import { UserName } from "src/user/domain/value-object/user-name"
import { UserPhone } from "src/user/domain/value-object/user-phone"
import { UserImage } from "src/user/domain/value-object/user-image"
import { UserRole } from "src/user/domain/value-object/user-role"



export class OdmUserMapper implements IMapper<User, OdmUserEntity>
{
    fromDomainToPersistence ( domain: User ): Promise<OdmUserEntity>
    {
        throw new Error( "Method not implemented." )
    }
    async fromPersistenceToDomain ( user: OdmUserEntity ): Promise<User>
    {
        return User.create(
            UserId.create(user.id),
            UserName.create(user.name),
            UserPhone.create(user.phone),
            UserEmail.create(user.email),
            UserImage.create(user.image),
            UserRole.create(user.role)
        )
    }
    
}