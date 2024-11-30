import { BadRequestException, Body, Controller, Logger, Post, Put } from "@nestjs/common";
import { ApiBody, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { Inject } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { DataSource } from "typeorm";
import { IEncryptor } from "src/common/application/encryptor/encryptor.interface";
import { IdGenerator } from "src/common/application/id-generator/id-generator.interface";
import { IJwtGenerator } from "src/common/application/jwt-generator/jwt-generator.interface";
import { UuidGenerator } from "src/common/infraestructure/id-generator/uuid-generator";
import { JwtGenerator } from "../jwt/jwt-generator";
import { EncryptorBcrypt } from "src/common/infraestructure/encryptor/encryptor-bcrypt";
import { LoggingDecorator } from "src/common/application/application-services/decorators/logging-decorator/logging.decorator";
import { NativeLogger } from "src/common/infraestructure/logger/logger";
import { UserCreated } from "src/user/domain/events/user-created-event";
import { OrmUser } from "src/user/infraestructure/entities/orm-entities/user.entity";
import { SignUpUserEntryInfraDto } from "../DTO/entry/sign-up-user-entry.dto";
import { SignUpUserSwaggerResponseDto } from "../DTO/response/sign-up-user-response.dto";
import { RabbitEventBus } from "src/common/infraestructure/rabbit-event-handler/rabbit-event-handler";
import { Querysynchronizer } from "src/common/infraestructure/query-synchronizer/query-synchronizer";
import { IAccountRepository } from "src/user/application/interface/account-user-repository.interface";
import { IUserRepository } from "src/user/domain/repositories/user-repository.interface";
import { NodemailerEmailSender } from "src/common/infraestructure/utils/nodemailer-email-sender.infraestructure";
import { SignUpEntryDto } from "src/auth/application/DTO/entry/sign-up-entry.application.dto";
import { SignUpUserApplicationService } from "src/auth/application/services/sign-up-user-service.application.service";
import { OrmUserRepository } from "src/user/infraestructure/repositories/orm-repositories/orm-user-repository";
import { UserMapper } from "src/user/infraestructure/mappers/orm-mapper/user-mapper";
import { OrmAccountRepository } from "src/user/infraestructure/repositories/orm-repositories/orm-account-repository";
import { IFileUploader } from "src/common/application/file-uploader/file-uploader.interface";
import { CloudinaryFileUploader } from "src/common/infraestructure/cloudinary-file-uploader/cloudinary-file-uploader";
import { ForgetPasswordEntryInfraDto } from "../DTO/entry/forget-password-entry.dto";
import { ForgetPasswordSwaggerResponseDto } from "../DTO/response/forget-password-response.dto";
import { GetCodeUpdatePasswordUserInfraService } from "../infra-service/get-code-update-password-service.infra.service";
import { SecretCodeGenerator } from "../secret-code-generator/secret-code-generator";
import { CodeValidateEntryInfraDto } from "../DTO/entry/code-validate-entry.dto";
import { ValidateCodeForgetPasswordSwaggerResponseDto } from "../DTO/response/val-code-swagger-response.dto";
import { ExceptionDecorator } from "src/common/application/application-services/decorators/exception-decorator/exception.decorator";
import { PerformanceDecorator } from "src/common/application/application-services/decorators/performance-decorator/performance-decorator";
import { HttpExceptionHandler } from "src/common/infraestructure/exception-handler/http-exception-handler-code";
import { ChangePasswordEntryInfraDto } from "../DTO/entry/change-password-entry.dto";
import { ChangePasswordSwaggerResponseDto } from "../DTO/response/change-password-response.dto";
import { ChangePasswordUserInfraService } from "../infra-service/change-password-user-service.infra.service";
//import { GetCodeUpdatePasswordUserInfraService } from "../infra-service/get-code-update-password-service.infra.service";

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    private readonly logger: Logger
    private readonly uuidGenerator: IdGenerator<string>
    private readonly tokenGenerator: IJwtGenerator<string>
    private readonly encryptor: IEncryptor
    private readonly eventBus = RabbitEventBus.getInstance();
    private readonly fileUploader: IFileUploader

    private readonly ormAccountRepository: IAccountRepository<OrmUser>
    private readonly userRepository: IUserRepository
    private readonly syncroInfraUser: Querysynchronizer<OrmUser>
    private secretCodes = []

    constructor(
        @Inject('DataSource') private readonly dataSource: DataSource,
        private jwtAuthService: JwtService
        
    ) {
        this.logger = new Logger('AuthController')
        this.uuidGenerator = new UuidGenerator()
        this.tokenGenerator = new JwtGenerator(jwtAuthService)
        this.encryptor = new EncryptorBcrypt()
        this.userRepository = new OrmUserRepository( new UserMapper(), dataSource )
        this.ormAccountRepository = new OrmAccountRepository( dataSource )
        this.fileUploader = new CloudinaryFileUploader()
    }

    @Post('register')
    @ApiOkResponse({ description: 'Registrar un nuevo usuario en el sistema', type: SignUpUserSwaggerResponseDto })
    @ApiBody({
        type: [SignUpEntryDto],
        description: 'Entradas para registrar un usuario nuevo',
    })
    async signUpUser(@Body() signUpDto: SignUpUserEntryInfraDto) {
        var data = { userId: 'none', ...signUpDto }
        if ( !data.type ) data = { type: 'CLIENT', ...data }

        const plainToHash = await this.encryptor.hashPassword(signUpDto.password)
        this.eventBus.subscribe('UserCreated', async (event: UserCreated) => {
            const sender = new NodemailerEmailSender();
            const user_id = event.userId;
            sender.sendWelcomeEmail(event.userEmail, "Jamal", user_id);
        });


        const signUpApplicationService = 
        //new ExceptionDecorator( 
             new LoggingDecorator(
        //         new PerformanceDecorator(    
                    new SignUpUserApplicationService(
                        this.eventBus,
                        this.userRepository,
                        this.uuidGenerator, 
                        this.fileUploader
                     ), 
                     new NativeLogger(this.logger)
            //     ),
            //     new NativeLogger(this.logger)
            // ),
            // new HttpExceptionHandler()
        )
        const resultService = (await signUpApplicationService.execute({
            userId: 'none',
            email: data.email,
            name: data.name,
            phone: data.phone,
            image: data.image,
            password: plainToHash,
            role: data.type //CAMBIAR
        }));

        return { id: resultService.Value.id }
    }

    @Post('forget/password')
    @ApiOkResponse({ description: 'Obtener codigo temporal para confirmar usuario', type: ForgetPasswordSwaggerResponseDto })
    @ApiBody({
        type: [ForgetPasswordEntryInfraDto],
        description: 'Email para generar código de confirmación',
    })
    async getCodeForUpdatePasswordUser(@Body() getCodeUpdateDto: ForgetPasswordEntryInfraDto ) {
        this.cleanSecretCodes()
        const data = { userId: 'none', ...getCodeUpdateDto, }
            
        const service = //new ExceptionDecorator( 
            new LoggingDecorator(
              //  new PerformanceDecorator(
                    new GetCodeUpdatePasswordUserInfraService(
                        this.ormAccountRepository,
                        getCodeUpdateDto.email,
                        new SecretCodeGenerator(),
                    ), 
                    new NativeLogger(this.logger)
               // ),
               // new NativeLogger(this.logger)
            )
           // new HttpExceptionHandler()
        //)
        const result = await service.execute(data)
        this.secretCodes = this.secretCodes.filter( e => e.email != result.Value.email )
        this.secretCodes.push( result.Value )
        console.log( this.secretCodes )
        return { 
            date: result.Value.date,
            code: result.Value.code
         } 
    }

    @Put('change/password')
    @ApiOkResponse({ description: 'Cambiar la contraseña del usuario', type: ChangePasswordSwaggerResponseDto })
    async changePasswordUser(@Body() updatePasswordDto: ChangePasswordEntryInfraDto ) {     
        this.cleanSecretCodes()
        const result = this.signCode(updatePasswordDto.code, updatePasswordDto.email)  
        if ( !result ) throw new BadRequestException('invalid secret code')
        const data = { userId: 'none',  ...updatePasswordDto }
        const service = //new ExceptionDecorator( 
            new LoggingDecorator(  
                //new PerformanceDecorator(
                    new ChangePasswordUserInfraService(
                        this.ormAccountRepository,
                        this.encryptor
                    ), 
                    new NativeLogger(this.logger)
             //   ),
                //new NativeLogger(this.logger)
            )
           // new HttpExceptionHandler()
        //)
        const result2 = await service.execute(data)
        // return { 
        //     previous_password: result2.Value,
        //     new_password: result2.Value.code
        //  } 
    }

    @Post('code/validate')
    @ApiOkResponse({  description: 'Validar codigo de cambio de contraseña', type: ValidateCodeForgetPasswordSwaggerResponseDto })
    async validateCodeForgetPassword( @Body() codeValDto: CodeValidateEntryInfraDto ) {  
        if ( !this.validateCode( codeValDto.code, codeValDto.email ) ) throw new BadRequestException('invalid secret code')
        console.log( "Se ha validado exitosamente la clave temporal" )
    }

    private validateCode( code: string, email: string ) {
        var nowTime = new Date().getTime()
        var search = this.secretCodes.filter( e => (e.code == code && e.email == email) )
        if ( search.length == 0 ) return false
        if ( (nowTime - search[0].date)/1000 >= 300 ) return false   
        return true
    }

    private signCode( code: string, email: string ) {
        var nowTime = new Date().getTime()
        var search = this.secretCodes.filter( e => (e.code == code && e.email == email) )
        if ( search.length == 0 ) return false
        if ( (nowTime - search[0].date)/1000 >= 300 ) return false   
        this.secretCodes = this.secretCodes.filter( e => (e.code != code && e.email != email) )
        return true
    }

    private async cleanSecretCodes() {
        var nowTime = new Date().getTime()
        this.secretCodes = this.secretCodes.filter( e => {
            var diff = (nowTime - e.date)/1000
            if ( diff <= 600 ) return e
        })
    }
}