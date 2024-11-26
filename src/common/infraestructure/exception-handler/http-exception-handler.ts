import {
    BadRequestException,
    NotFoundException,
    InternalServerErrorException,
    ForbiddenException,
    ConflictException,
} from '@nestjs/common';
import { IExceptionHandler } from 'src/common/Application/exception-handler/exception-handler.interface'
import { DomainException } from 'src/common/domain/domain-exception/domain-exception';

export class HttpExceptionHandler implements IExceptionHandler {

    HandleException(name_exception: string, message: string, error: Error) {
        switch (name_exception) {
            case "InvalidUser":
                return this.BadRequest(message, error);
            case "InvalidUserEmailException":
                return this.BadRequest(message, error);
            case "InvalidUserName":
                return this.BadRequest(message, error);
            case "InvalidUserPhone":
                return this.BadRequest(message, error);
            case "UserNotFoundException":
                return this.NotFound(message, error);
            default:
                return this.InternalServerError(message, error);
        }
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