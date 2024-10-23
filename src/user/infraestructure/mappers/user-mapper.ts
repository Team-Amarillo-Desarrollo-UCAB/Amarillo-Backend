import { IMapper } from "src/common/application/mappers/mapper.interface";
import { User } from "src/user/domain/user";
import { OrmUser } from "../entities/user.entity";

export class UserMapper implements IMapper<User,OrmUser>{
    
    async fromDomainToPersistence(domain: User): Promise<OrmUser> {
        const persistanceUser = OrmUser.create(
            domain.Id,
            domain.Name,
            domain.Phone,
            domain.Email
        )
        return persistanceUser
    }
    
    async fromPersistenceToDomain(persistence: OrmUser): Promise<User> {
        const domainUser = User.create(
            persistence.id,
            persistence.name,
            persistence.phone,
            persistence.email,
            persistence.type
        );
        return domainUser
    }

}