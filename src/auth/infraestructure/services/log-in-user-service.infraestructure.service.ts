import { IApplicationService } from "src/common/application/application-services/application-service.interface";
import { LogInUserServiceEntryDto } from "src/auth/infraestructure/services/DTO/entry/log-in-entry.infraestructure.dto";
import { LogInServiceResponseDto } from "src/auth/infraestructure/services/DTO/response/log-in-response.dto";
import { IAccountRepository } from "src/user/application/interface/account-user-repository.interface";
import { IJwtGenerator } from "src/common/application/jwt-generator/jwt-generator.interface";
import { IEncryptor } from "src/common/application/encryptor/encryptor.interface";
import { Result } from "src/common/domain/result-handler/Result";
import { IncorrectPasswordException } from "src/user/infraestructure/exceptions/incorrect-password-exception";
import { OrmUser } from "src/user/infraestructure/entities/orm-entities/user.entity";

export class LogInUserInfraService implements IApplicationService<LogInUserServiceEntryDto, LogInServiceResponseDto> {

    private readonly accountRepository: IAccountRepository<OrmUser>
    private readonly tokenGenerator: IJwtGenerator<string>;
    private readonly encryptor: IEncryptor;

    constructor(
        accountRepository: IAccountRepository<OrmUser>,
        tokenGenerator: IJwtGenerator<string>,
        encryptor: IEncryptor,
    ) {
        this.accountRepository = accountRepository
        this.tokenGenerator = tokenGenerator
        this.encryptor = encryptor
    }

    async execute(logInDto: LogInUserServiceEntryDto): Promise<Result<LogInServiceResponseDto>> {
        console.log(this.accountRepository)
        const findResult = await this.accountRepository.findUserByEmail(logInDto.email)
        if (!findResult.isSuccess())
            return Result.fail(findResult.Error, findResult.StatusCode, findResult.Message)
        const userResult = await findResult.Value

        const checkPassword = await this.encryptor.comparePlaneAndHash(logInDto.password, userResult.password)
        if (!checkPassword)
            return Result.fail(new IncorrectPasswordException(), 403, 'Incorrect password')

        const token = this.tokenGenerator.generateJwt(userResult.id)
        const answer = {
            token: token,
            type: userResult.type,
            user: {
                id: userResult.id,
                email: userResult.email,
                name: userResult.name,
                phone: userResult.phone,
            }
        }
        return Result.success(answer, 200)
    }

    get name(): string { return this.constructor.name }
}