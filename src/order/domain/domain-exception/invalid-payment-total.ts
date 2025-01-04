import { DomainException } from "../../../common/domain/domain-exception/domain-exception";

export class InvalidOrderPaymentTotal extends DomainException {
    constructor(msg: string) {
        super(msg);
    }
}