
import { DomainException } from "src/common/domain/domain-exception/domain-exception";

export class InvalidProductPriceAmount extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
