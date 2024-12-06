import { IMapper } from "src/common/application/mappers/mapper.interface";
import { User } from "src/user/domain/user";
import { OrmUser } from "../../entities/orm-entities/user.entity";
import { UserId } from "src/user/domain/value-object/user-id";
import { UserName } from "src/user/domain/value-object/user-name";
import { UserPhone } from "src/user/domain/value-object/user-phone";
import { UserEmail } from "src/user/domain/value-object/user-email";
import { UserImage } from "src/user/domain/value-object/user-image";
import { UserRole } from "src/user/domain/value-object/user-role";

export class UserMapper implements IMapper<User,OrmUser>{
    
    async fromDomainToPersistence(domain: User): Promise<OrmUser> {
        const persistanceUser = OrmUser.create(
            domain.Id.Id,
            domain.Name,
            domain.Phone,
            domain.Email,
            domain.Image
        )
        return persistanceUser
    }
    
    async fromPersistenceToDomain(persistence: OrmUser): Promise<User> {
        const domainUser = User.create(
            UserId.create(persistence.id),
            UserName.create(persistence.name),
            UserPhone.create(persistence.phone),
            UserEmail.create(persistence.email),
            UserImage.create(persistence.image),
            UserRole.create(persistence.type)
        );
        return domainUser
    }

}