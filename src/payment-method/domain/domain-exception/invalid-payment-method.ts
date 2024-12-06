import { DomainException } from "../../../common/domain/domain-exception/domain-exception";

export class InvalidPaymentMethod extends DomainException {
    constructor(msg: string) {
        super(msg);
    }
}