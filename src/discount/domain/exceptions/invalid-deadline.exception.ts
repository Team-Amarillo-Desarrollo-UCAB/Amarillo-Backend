import { DomainException } from "src/common/domain/domain-exception/domain-exception";

export class InvalidDeadlineException extends DomainException {
    constructor(message: string) {
      super(message);
      this.name = "InvalidDeadlineException";
    }
  }
  