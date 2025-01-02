import {
    BadRequestException,
    NotFoundException,
    InternalServerErrorException,
    ForbiddenException,
    ConflictException,
} from '@nestjs/common';
import { IExceptionHandlerCode } from 'src/common/application/exception-handler/exception-handler-code.interface';
import { UnauthorizedException } from '@nestjs/common';

export class HttpExceptionHandler implements IExceptionHandlerCode {

    HandleException(status: number, msg: string, error?: any) {
        switch (status) {
            case 400:
                return this.BadRequest(msg, error);
            case 401:
                return this.Unauthorized(msg,error)
            case 403:
                return this.Forbidden(msg, error)
            case 404:
                return this.NotFound(msg, error);
            case 409:
                return this.Conflict(msg, error);
            case 500:
                return this.InternalServerError(msg, error);
            default:
                return this.InternalServerError(msg, error);
        }
    }

    private Unauthorized(msg: string, error?: any):void{
        throw new UnauthorizedException(msg,error);
    }
    private Conflict(msg: string, error?: any): void {
        throw new ConflictException(msg, error);
    }

    private BadRequest(msg: string, error?: any): void {
        throw new BadRequestException(msg, error);
    }

    private NotFound(msg: string, error?: any): void {
        throw new NotFoundException(msg, error);
    }

    public Forbidden(msg: string, error?: any): void {
        throw new ForbiddenException(msg, error);
    }

    private InternalServerError(msg: string, error?: any): void {
        throw new InternalServerErrorException(msg, error);
    }
}