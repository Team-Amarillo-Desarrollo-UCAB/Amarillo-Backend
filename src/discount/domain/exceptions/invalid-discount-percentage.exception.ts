import { DomainException } from "src/common/domain/domain-exception/domain-exception";

export class InvalidDiscountPercentageException extends DomainException {
    constructor(message: string) {
        super(message);
        this.name = "InvalidDiscountPercentageException";
    }
}