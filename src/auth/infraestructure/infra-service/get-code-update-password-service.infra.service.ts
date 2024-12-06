import { IApplicationService } from "src/common/application/application-services/application-service.interface";
import { ForgetPasswordEntryDto } from "./dto/entry/forget-password-entry.infraestructure.dto";
import { GetCodeServiceResponseDto } from "./dto/response/get-code-service-response";
import { OrmUser } from "src/user/infraestructure/entities/orm-entities/user.entity";
import { ICodeGenerator } from "src/common/application/code-generator/code-generator.interface";
import { IAccountRepository } from "src/user/application/interface/account-user-repository.interface";
import { NodemailerEmailSender } from "src/common/infraestructure/utils/nodemailer-email-sender.infraestructure";
import { Result } from "src/common/domain/result-handler/Result";

export class GetCodeUpdatePasswordUserInfraService implements IApplicationService<ForgetPasswordEntryDto, GetCodeServiceResponseDto> {

    private readonly accountRepository: IAccountRepository<OrmUser>
    private readonly email: string;
    private readonly codeGenerator: ICodeGenerator<string>; 
    constructor(
        accountRepository: IAccountRepository<OrmUser>,
        email: string,
        codeGenerator: ICodeGenerator<string>,
    ){
        this.accountRepository = accountRepository
        this.email = email
        this.codeGenerator = codeGenerator
    }
    
    async execute(forgetDto: ForgetPasswordEntryDto): Promise<Result<GetCodeServiceResponseDto>> {
        const result = await this.accountRepository.findUserByEmail( forgetDto.email )
        if ( !result.isSuccess() ) return Result.fail( result.Error, result.StatusCode, result.Message )
        const code = this.codeGenerator.generateCode(4)
        const sender = new NodemailerEmailSender();
        sender.sendCode(this.email, "Jamal", code);

        const answer = { 
            email: this.email,
            code: code,
            date: new Date()
        }
        return Result.success(answer, 200)
    }
  
    get name(): string { return this.constructor.name }
}
