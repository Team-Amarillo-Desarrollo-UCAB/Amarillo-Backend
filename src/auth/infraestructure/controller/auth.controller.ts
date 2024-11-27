import { Body, Controller, Logger, Post } from "@nestjs/common";
import { ApiOkResponse, ApiProperty, ApiTags } from "@nestjs/swagger";
import { Inject } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { DataSource } from "typeorm";

import { IEncryptor } from "src/common/application/encryptor/encryptor.interface";
import { IdGenerator } from "src/common/application/id-generator/id-generator.interface";
import { IJwtGenerator } from "src/common/application/jwt-generator/jwt-generator.interface";
import { UuidGenerator } from "src/common/infraestructure/id-generator/uuid-generator";
import { JwtGenerator } from "../jwt/jwt-generator";
import { EncryptorBcrypt } from "src/common/infraestructure/encryptor/encryptor-bcrypt";
import { LogInUserResponseDto } from "../DTO/response/log-in-user-reponses.dto";
import { LogInUserEntryInfraDto } from "../DTO/entry/log-in-user-entry.dto";
import { LogInUserServiceEntryDto } from "../services/DTO/entry/log-in-entry.infraestructure.dto";
import { PerformanceDecorator } from "src/common/application/application-services/decorators/performance-decorator/performance-decorator";
import { LoggingDecorator } from "src/common/application/application-services/decorators/logging-decorator/logging.decorator";
import { NativeLogger } from "src/common/infraestructure/logger/logger";
import { LogInUserInfraService } from "../services/log-in-user-service.infraestructure.service";
import { OrmAccountRepository } from "src/user/infraestructure/repositories/account-repository";
import { IAccountRepository } from "src/user/application/interface/account-user-repository.interface";
import { OrmUser } from "src/user/infraestructure/entities/user.entity";
import { ExceptionDecorator } from "src/common/application/application-services/decorators/exception-decorator/exception.decorator";
import { IExceptionHandler } from "src/common/application/exception-handler/exception-handler.interface";
import { HttpExceptionHandler } from "src/common/infraestructure/exception-handler/http-exception-handler-code";

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    private readonly logger: Logger
    private readonly uuidGenerator: IdGenerator<string>
    private readonly tokenGenerator: IJwtGenerator<string>
    private readonly encryptor: IEncryptor
    private readonly exceptionHandler: IExceptionHandler

    private accountRepository: IAccountRepository<OrmUser>

    constructor(
        @Inject('DataSource') private readonly dataSource: DataSource,
        private jwtAuthService: JwtService
    ) {
        this.logger = new Logger('AuthController')
        this.uuidGenerator = new UuidGenerator()
        this.tokenGenerator = new JwtGenerator(jwtAuthService)
        this.encryptor = new EncryptorBcrypt()
        this.accountRepository = new OrmAccountRepository(dataSource)
    }

    @Post('login')
    @ApiOkResponse({
        description: 'Iniciar sesion de usuario',
        type: LogInUserResponseDto
    })
    async logInUser(
        @Body() logInDto: LogInUserEntryInfraDto
    ) {

        const entry: LogInUserServiceEntryDto = {
            userId: "none",
            email: logInDto.email,
            password: logInDto.password
        }

        const service =
            new ExceptionDecorator(
                new PerformanceDecorator(
                    new LoggingDecorator(
                        new LogInUserInfraService(
                            this.accountRepository,
                            this.tokenGenerator,
                            this.encryptor
                        ),
                        new NativeLogger(this.logger)
                    ),
                    new NativeLogger(this.logger)
                ),
                new HttpExceptionHandler(),
            )


        const result = await service.execute(entry)

        const response: LogInUserResponseDto = {
            ...result.Value
        }

        return response

    }

}