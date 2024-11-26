export interface IExceptionHandlerCode {
    HandleException(statusCode: number, message: string, error: Error): void
}