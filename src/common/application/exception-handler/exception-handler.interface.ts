import { DomainException } from "src/common/domain/domain-exception/domain-exception";

export interface IExceptionHandler {
    HandleException(statusCode: number, message: string, error: DomainException): void
}