import { DomainException } from "../../../common/domain/domain-exception/domain-exception";

export class InvalidOrderId extends DomainException {
    constructor(msg: string) {
        super(msg);
    }
}