import { IApplicationService } from "src/common/application/application-services/application-service.interface"
import { IEventHandler } from "src/common/application/event-handler/event-handler.interface"
import { Result } from "src/common/domain/result-handler/Result"
import { IUserRepository } from "src/user/domain/repositories/user-repository.interface"
import { UserEmail } from "src/user/domain/value-object/user-email"
import { UserName } from "src/user/domain/value-object/user-name"
import { UserPhone } from "src/user/domain/value-object/user-phone"
import { UpdateUserProfileServiceEntryDto } from "../../DTO/params/update-user-profile-service-entry.dto"
import { UpdateUserProfileServiceResponseDto } from "../../DTO/responses/update-user-profile-service-response.dto"



export class UpdateUserProfileAplicationService implements IApplicationService<UpdateUserProfileServiceEntryDto,UpdateUserProfileServiceResponseDto>{
    
    private readonly userRepository: IUserRepository
    private readonly eventHandler: IEventHandler

    constructor ( 
        userRepository: IUserRepository,
        eventHandler: IEventHandler
    ){
        this.userRepository = userRepository
        this.eventHandler = eventHandler
    }

    async execute(data: UpdateUserProfileServiceEntryDto): Promise<Result<UpdateUserProfileServiceResponseDto>> {

        if ( data.email ) {
            const verifyEmail = await this.userRepository.verifyUserExistenceByEmail(data.email)
            if ( !verifyEmail.isSuccess() ) return Result.fail( verifyEmail.Error, verifyEmail.StatusCode, verifyEmail.Message )
        }

        if ( data.phone ) {
            const verifyPhone = await this.userRepository.verifyUserExistenceByPhone(data.phone)
            if ( !verifyPhone.isSuccess() ) return Result.fail( verifyPhone.Error, verifyPhone.StatusCode, verifyPhone.Message )
        }

        const user = await this.userRepository.findUserById(data.userId)
        if(!user.isSuccess()) return Result.fail<UpdateUserProfileServiceResponseDto>(user.Error,user.StatusCode,user.Message)
        const userResult = user.Value
        userResult.pullEvents()
        if (data.name) userResult.updateName(UserName.create(data.name))
        if (data.email) userResult.updateEmail(UserEmail.create(data.email))
        if (data.phone) userResult.updatePhone(UserPhone.create(data.phone))
        const updateResult = await this.userRepository.saveUserAggregate(userResult);

        if ( !updateResult.isSuccess() ) 
            Result.fail<UpdateUserProfileAplicationService>(updateResult.Error, 500, updateResult.Message)
        
        this.eventHandler.publish(userResult.pullEvents())
        const respuesta: UpdateUserProfileServiceResponseDto = {
            userId: updateResult.Value.Id.Id
        }
        return Result.success<UpdateUserProfileServiceResponseDto>(respuesta,200)

    }

    get name(): string {
        return this.constructor.name
    }

}