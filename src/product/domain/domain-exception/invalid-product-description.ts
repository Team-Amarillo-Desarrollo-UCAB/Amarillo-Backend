import { DomainException } from "../../../common/domain/domain-exception/domain-exception";

export class InvalidProductDescription extends DomainException {
    constructor(msg: string) {
        super(msg);
    }
}