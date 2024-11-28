import { IApplicationService } from "src/common/application/application-services/application-service.interface"
import { IEventHandler } from "src/common/application/event-handler/event-handler.interface"
import { IdGenerator } from "src/common/application/id-generator/id-generator.interface"
import { Result } from "src/common/domain/result-handler/Result"
import { IUserRepository } from "src/user/domain/repositories/user-repository.interface"
import { User } from "src/user/domain/user"
import { UserEmail } from "src/user/domain/value-object/user-email"
import { UserId } from "src/user/domain/value-object/user-id"
import { UserImage } from "src/user/domain/value-object/user-image"
import { UserName } from "src/user/domain/value-object/user-name"
import { UserPhone } from "src/user/domain/value-object/user-phone"
import { UserRole } from "src/user/domain/value-object/user-role"
import { SignUpEntryDto } from "../DTO/entry/sign-up-entry.application.dto"
import { SignUpResponseDto } from "../DTO/response/sign-up-response.application.dto"



export class SignUpUserApplicationService implements IApplicationService<SignUpEntryDto, SignUpResponseDto> {
    
    private readonly userRepository: IUserRepository
    private readonly uuidGenerator: IdGenerator<string>
    private readonly eventHandler: IEventHandler
        
    constructor(
        eventHandler: IEventHandler,
        userRepository: IUserRepository,
        uuidGenerator: IdGenerator<string>,
    ){
        this.userRepository = userRepository
        this.uuidGenerator = uuidGenerator
        this.eventHandler = eventHandler
    }
    
    async execute(signUpDto: SignUpEntryDto): Promise<Result<SignUpResponseDto>> {
        
        const findResult = await this.userRepository.verifyUserExistenceByEmail( signUpDto.email )
        if ( !findResult.isSuccess() ) return Result.fail( findResult.Error, findResult.StatusCode, findResult.Message )

        const idUser = await this.uuidGenerator.generateId()

        const create = User.create(
            UserId.create(idUser), 
            UserName.create(signUpDto.name), 
            UserPhone.create(signUpDto.phone), 
            UserEmail.create(signUpDto.email),
            UserImage.create(signUpDto.image),
            UserRole.create(signUpDto.role)
        )
        const userResult = await this.userRepository.saveUserAggregate( create )
        if ( !userResult.isSuccess() ) return Result.fail( userResult.Error, userResult.StatusCode, userResult.Message )        
        
        await this.eventHandler.publish( create.pullEvents() )

        const answer = { 
            id: idUser,
            email: signUpDto.email,
            name: signUpDto.name 
        }
        return Result.success(answer, 200)
    }
   
    get name(): string { return this.constructor.name }
}