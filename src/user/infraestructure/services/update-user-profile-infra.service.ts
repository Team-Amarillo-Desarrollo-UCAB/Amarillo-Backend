import { IApplicationService } from "src/common/application/application-services/application-service.interface"
import { IEncryptor } from "src/common/application/encryptor/encryptor.interface"
import { IdGenerator } from "src/common/application/id-generator/id-generator.interface"
import { Result } from "src/common/domain/result-handler/Result"
import { IAccountRepository } from "src/user/application/interface/account-user-repository.interface"
import { OrmUser } from "../entities/orm-entities/user.entity"
import { UpdateUserProfileInfraServiceEntryDto } from "./dto/update-user-profile-infra-service-entry-dto"
import { UpdateUserProfileInfraServiceResponseDto } from "./dto/update-user-profile-infra-service-response-dto"
import { IFileUploader } from "src/common/application/file-uploader/file-uploader.interface"


export class UpdateUserProfileInfraService implements IApplicationService<UpdateUserProfileInfraServiceEntryDto,UpdateUserProfileInfraServiceResponseDto>{
    
    private readonly sqlRepository: IAccountRepository<OrmUser>
    private readonly idGenerator: IdGenerator<string>
    private readonly encryptor: IEncryptor
    private readonly fileUploader: IFileUploader

    constructor ( 
        sqlRepository: IAccountRepository<OrmUser>,
        idGenerator: IdGenerator<string>,
        encryptor: IEncryptor,
        fileUploader: IFileUploader
    ){
        this.sqlRepository = sqlRepository
        this.idGenerator = idGenerator
        this.encryptor = encryptor
        this.fileUploader = fileUploader
    }

    async execute(data: UpdateUserProfileInfraServiceEntryDto): Promise<Result<UpdateUserProfileInfraServiceResponseDto>> {
        console.log(data)
        const user = await this.sqlRepository.findUserById(data.userId)
        
        if(!user.isSuccess())
            return Result.fail<UpdateUserProfileInfraServiceResponseDto>(user.Error,user.StatusCode,user.Message)
        
        const userResult = user.Value
        const image_url = await this.fileUploader.UploadFile(data.image)
        
        const userUpdate: OrmUser = await OrmUser.create(
            userResult.id,
            userResult.name,
            userResult.phone,
            userResult.email,
            image_url,
            (data.password) ? await this.encryptor.hashPassword(data.password) : userResult.password,
        )
        
        const updateResult = await this.sqlRepository.saveUser(userUpdate)

        if(!updateResult.isSuccess()) 
            return Result.fail<UpdateUserProfileInfraServiceResponseDto>(updateResult.Error,updateResult.StatusCode,updateResult.Message)


        const respuesta: UpdateUserProfileInfraServiceResponseDto = {
            userId: userResult.id
        }

        return Result.success<UpdateUserProfileInfraServiceResponseDto>(respuesta,200)
    }

    get name(): string {
        return this.constructor.name
    }

}