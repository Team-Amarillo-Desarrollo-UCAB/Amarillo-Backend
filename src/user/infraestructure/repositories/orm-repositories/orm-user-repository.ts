import { DataSource, Repository } from "typeorm";
import { OrmUser } from "../../entities/orm-entities/user.entity";
import { IUserRepository } from "src/user/domain/repositories/user-repository.interface";
import { Result } from "src/common/domain/result-handler/Result";
import { User } from "src/user/domain/user";
import { IMapper } from "src/common/application/mappers/mapper.interface";

export class OrmUserRepository extends Repository<OrmUser> implements IUserRepository{

    private readonly ormUserMapper: IMapper<User,OrmUser>

    constructor(ormUserMapper: IMapper<User,OrmUser>, dataSource: DataSource){
        super(OrmUser, dataSource.createEntityManager());
        this.ormUserMapper = ormUserMapper
    }

    async saveUserAggregate(user: User): Promise<Result<User>> {
        const ormUser = await this.ormUserMapper.fromDomainToPersistence( user )
        await this.save( ormUser )
        return Result.success<User>( user, 200 )
    }

    async findUserByEmail(email: string): Promise<Result<User>> {
        const ormUser = await this.findOneBy({email})
        if(!ormUser){
            return Result.fail<User>(new Error("User not found") , 404, "User not found" )
        }
        const user = await this.ormUserMapper.fromPersistenceToDomain(ormUser)
        return Result.success<User>( user, 200 )
    }

    async verifyUserExistenceByEmail(email: string): Promise<Result<boolean>> {
        const ormUser = await this.findOneBy({email})
        if(!ormUser){
            return Result.success<boolean>(true, 200)
        }
        return Result.fail<boolean>(new Error("User not found") , 404, "User not found" )
    }

    async verifyUserExistenceByPhone(phone: string): Promise<Result<boolean>> {
        const ormUser = await this.findOneBy({phone})
        if(!ormUser){
            return Result.success<boolean>(true, 200)
        }
        return Result.fail<boolean>(new Error("User not found") , 404, "User not found" )
    }

    async findUserById(id: string): Promise<Result<User>> {
        const ormUser = await this.findOneBy({id})
        if(!ormUser){
            return Result.fail<User>(new Error("User not found") , 404, "User not found" )
        }
        const user = await this.ormUserMapper.fromPersistenceToDomain(ormUser)
        return Result.success<User>( user, 200 )
    }
    
}