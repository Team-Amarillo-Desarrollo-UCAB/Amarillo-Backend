import { IApplicationService } from "src/common/application/application-services/application-service.interface";
import { IEncryptor } from "../../../common/application/encryptor/encryptor.interface";
import { OrmUser } from "src/user/infraestructure/entities/orm-entities/user.entity";
import { IAccountRepository } from "src/user/application/interface/account-user-repository.interface";
import { ChangePasswordEntryDto } from "./dto/entry/change-password-entry.infraestructure.dto";
import { Result } from "src/common/domain/result-handler/Result";


export class ChangePasswordUserInfraService implements IApplicationService<ChangePasswordEntryDto, boolean> {
    
    private readonly sqlAccountRepo: IAccountRepository<OrmUser>
    private readonly encryptor: IEncryptor; 

    constructor(
        sqlRepository: IAccountRepository<OrmUser>,
        encryptor: IEncryptor
    ){
        this.sqlAccountRepo = sqlRepository
        this.encryptor = encryptor
    }
    
    async execute(updateDto: ChangePasswordEntryDto): Promise<Result<boolean>> {
        const hashPassword = await this.encryptor.hashPassword( updateDto.password )
        const result = await this.sqlAccountRepo.updateUserPassword( updateDto.email, hashPassword )
        if ( !result.isSuccess() ) return Result.fail( result.Error, result.StatusCode, result.Message )
        return Result.success(true, 200)
    }
   
    get name(): string { return this.constructor.name }
}