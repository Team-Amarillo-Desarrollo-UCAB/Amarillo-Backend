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

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    private readonly logger: Logger
    private readonly uuidGenerator: IdGenerator<string>
    private readonly tokenGenerator: IJwtGenerator<string>
    private readonly encryptor: IEncryptor

    constructor(
        @Inject('DataSource') private readonly dataSource: DataSource,
        private jwtAuthService: JwtService
    ) {
        this.logger = new Logger('AuthController')
        this.uuidGenerator = new UuidGenerator()
        this.tokenGenerator = new JwtGenerator(jwtAuthService)
        this.encryptor = new EncryptorBcrypt()
    }
}