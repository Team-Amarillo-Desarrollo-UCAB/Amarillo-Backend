import { DomainException } from "src/common/domain/domain-exception/domain-exception";

export class InvalidOrderReciviedDate extends DomainException {
    constructor(msg: string) {
        super(msg);
    }
}