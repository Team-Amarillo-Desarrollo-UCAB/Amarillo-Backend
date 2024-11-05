// TODO: Quitar el codigo del error debido a la fuga de infraestructura

export class Result<T> {
  private value?: T;
  private error?: Error;
  private errorCode?: number;
  private message?: string;

  private constructor(
    value: T,
    error: Error,
    errorCode: number,//esto es de la capa de infraestructura, NO de dominio!!
    message: string,
  ) {
    this.error = error;
    this.errorCode = errorCode;
    this.value = value;
    this.message = message;
  }

  isSuccess(): boolean {
    if (this.value || this.Value == 0) return true;
    return false;
  }

  get Value(): T {
    if (this.isSuccess) return this.value;
    throw new Error('The value does not exists');
  }

  get Error(): Error {
    if (this.error) return this.error;
    throw new Error('The error does not exists');
  }

  get StatusCode(): number {
    return this.errorCode;
  }

  get Message(): string {
    if (this.message) return this.message;
    throw new Error('The message does not exists');
  }

  static success<T>(value: T, statusCode: number): Result<T> {
    return new Result(value, null, statusCode, null);
  }

  static fail<T>(error: Error, errorCode: number, message: string): Result<T> {
    return new Result(null, error, errorCode, message);
  }
}
