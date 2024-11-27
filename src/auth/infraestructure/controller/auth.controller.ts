import { Controller, Logger } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Inject } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { DataSource } from "typeorm";

import { IEncryptor } from "src/common/application/encryptor/encryptor.interface";
import { IdGenerator } from "src/common/application/id-generator/id-generator.interface";
import { IJwtGenerator } from "src/common/application/jwt-generator/jwt-generator.interface";
import { UuidGenerator } from "src/common/infraestructure/id-generator/uuid-generator";
import { JwtGenerator } from "../jwt/jwt-generator";
import { EncryptorBcrypt } from "src/common/infraestructure/encryptor/encryptor-bcrypt";
//import { OdmUserEntity } from "src/user/infraestructure/entities/odm-entities/odm-user.entity";
//import { InjectModel } from "@nestjs/mongoose";

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    private readonly logger: Logger
    private readonly uuidGenerator: IdGenerator<string>
    private readonly tokenGenerator: IJwtGenerator<string>
    private readonly encryptor: IEncryptor

/*
    private readonly ormAccountRepository: IAccountRepository<OrmUser>
    private readonly odmAccountRepository: IAccountRepository<OdmUserEntity>
    private readonly userRepository: IUserRepository
    private readonly syncroInfraUser: Querysynchronizer<OrmUser>
    */
    private secretCodes = []

    constructor(
       // @InjectModel('User') private userModel: Model<OdmUserEntity>,
        @Inject('DataSource') private readonly dataSource: DataSource,
        private jwtAuthService: JwtService
    ) {
        this.logger = new Logger('AuthController')
        this.uuidGenerator = new UuidGenerator()
        this.tokenGenerator = new JwtGenerator(jwtAuthService)
        this.encryptor = new EncryptorBcrypt()

        /*
         this.syncroInfraUser = new AccountQuerySynchronizer( new OdmUserRepository( userModel ), userModel )
        this.userRepository = new OrmUserRepository( new OrmUserMapper(), dataSource )
        this.odmAccountRepository = new OdmAccountRepository( userModel )
        this.ormAccountRepository = new OrmAccountRepository( dataSource )
        */
    }
/*
    @Post('register')
    @ApiOkResponse({ description: 'Registrar un nuevo usuario en el sistema', type: SignUpUserSwaggerResponseDto })
    async signUpUser(@Body() signUpDto: SignUpUserEntryInfraDto) {
        var data = { userId: 'none', ...signUpDto }
        if ( !data.type ) data = { type: 'CLIENT', ...data }

        const plainToHash = await this.encryptor.hashPassword(signUpDto.password)

        const emailSender = new WelcomeSender()
        emailSender.setVariables( { firstname: signUpDto.name } )
        
        const eventBus = EventBus.getInstance()
        const suscribe = eventBus.subscribe('UserCreated', async (event: UserCreated) => {
            const ormUser = OrmUser.create( 
                event.userId, event.userName, event.userPhone, event.userEmail, null, plainToHash, data.type, 
            )
            this.ormAccountRepository.saveUser( ormUser )
            this.syncroInfraUser.execute( ormUser )
            emailSender.sendEmail( signUpDto.email, signUpDto.name )
        })

        const signUpApplicationService = new ExceptionDecorator( 
            new LoggingDecorator(
                new PerformanceDecorator(    
                    new SignUpUserApplicationService(
                        eventBus,
                        this.userRepository,
                        this.uuidGenerator
                    ), 
                    new NativeLogger(this.logger)
                ),
                new NativeLogger(this.logger)
            ),
            new HttpExceptionHandler()
        )
        const resultService = (await signUpApplicationService.execute({
            userId: 'none',
            email: data.email,
            name: data.name,
            phone: data.phone,
        }));
        (await suscribe).unsubscribe()

        return { id: resultService.Value.id }
    }
    
    @Post('forget/password')
    @ApiOkResponse({ description: 'Obtener codigo temporal para confirmar usuario', type: ForgetPasswordSwaggerResponseDto })
    async getCodeForUpdatePasswordUser(@Body() getCodeUpdateDto: ForgetPasswordEntryInfraDto ) {
        this.cleanSecretCodes()
        const data = { userId: 'none', ...getCodeUpdateDto, }
        const service = new ExceptionDecorator( 
            new LoggingDecorator(
                new PerformanceDecorator(
                    new GetCodeUpdatePasswordUserInfraService(
                        this.ormAccountRepository,
                        new UpdatePasswordSender(),
                        new SecretCodeGenerator(),
                    ), 
                    new NativeLogger(this.logger)
                ),
                new NativeLogger(this.logger)
            ),
            new HttpExceptionHandler()
        )
        const result = await service.execute(data)
        this.secretCodes = this.secretCodes.filter( e => e.email != result.Value.email )
        this.secretCodes.push( result.Value )
        console.log( this.secretCodes )
        return { date: result.Value.date }
    }

    @Put('change/password')
    @ApiOkResponse({ description: 'Cambiar la contraseña del usuario', type: ChangePasswordSwaggerResponseDto })
    async changePasswordUser(@Body() updatePasswordDto: ChangePasswordEntryInfraDto ) {     
        this.cleanSecretCodes()
        const result = this.signCode(updatePasswordDto.code, updatePasswordDto.email)  
        if ( !result ) throw new BadRequestException('invalid secret code')
        const data = { userId: 'none',  ...updatePasswordDto }
        const service = new ExceptionDecorator( 
            new LoggingDecorator(
                new PerformanceDecorator(
                    new ChangePasswordUserInfraService(
                        this.ormAccountRepository,
                        this.encryptor,
                        this.odmAccountRepository
                    ), 
                    new NativeLogger(this.logger)
                ),
                new NativeLogger(this.logger)
            ),
            new HttpExceptionHandler()
        )
        await service.execute(data)
    }
    
    @Post('code/validate')
    @ApiOkResponse({  description: 'Validar codigo de cambio de contraseña', type: ValidateCodeForgetPasswordSwaggerResponseDto })
    async validateCodeForgetPassword( @Body() codeValDto: CodeValidateEntryInfraDto ) {  
        if ( !this.validateCode( codeValDto.code, codeValDto.email ) ) throw new BadRequestException('invalid secret code')
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
    }*/
}