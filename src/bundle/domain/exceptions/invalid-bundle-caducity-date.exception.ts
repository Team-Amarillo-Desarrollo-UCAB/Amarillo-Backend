
import { DomainException } from "src/common/domain/domain-exception/domain-exception";

export class InvalidCaducityDateException extends DomainException {
    constructor(message: string) {
      super(message);
    }
  }
  