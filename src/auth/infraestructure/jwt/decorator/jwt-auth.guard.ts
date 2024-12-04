import { Injectable, CanActivate, Inject, ExecutionContext, UnauthorizedException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { Result } from "src/common/domain/result-handler/Result"
import { OrmUser } from "src/user/infraestructure/entities/orm-entities/user.entity"
import { OrmAccountRepository } from "src/user/infraestructure/repositories/orm-repositories/orm-account-repository"
import { DataSource } from "typeorm"
import { JwtPayload } from "./dto/jwt-payload.interface"


@Injectable()
export class JwtAuthGuard implements CanActivate {

    private userRepository: OrmAccountRepository

    constructor(
        private jwtService: JwtService,
        @Inject('DataSource') dataSource: DataSource
    ) {
        this.userRepository = new OrmAccountRepository(dataSource)
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        if (!request.headers['authorization']) throw new UnauthorizedException()
        const [type, token] = request.headers['authorization'].split(' ') ?? []
        if (type != 'Bearer' || !token) throw new UnauthorizedException()
        try {
            const payload = await this.jwtService.verifyAsync(token, { secret: process.env.JWT_SECRET_KEY })
            const userData = await this.validate(payload)
            // Payload incluye iat y exp, fecha de firma y de vencimiento
            request['user'] = userData
        } catch { throw new UnauthorizedException() }
        return true
    }

    private async validate(payload: JwtPayload) {
        const user: Result<OrmUser> = await this.userRepository.findUserById( payload.id );
        if ( !user.isSuccess() ) throw new Error('Error buscando al usuario a traves del token')
        return user.Value;
    }

}