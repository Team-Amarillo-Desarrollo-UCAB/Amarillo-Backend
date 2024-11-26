import { DomainException } from "src/common/domain/domain-exception/domain-exception";

export interface IExceptionHandler {
    HandleException(name_exception: string, message: string, error: DomainException): void
}