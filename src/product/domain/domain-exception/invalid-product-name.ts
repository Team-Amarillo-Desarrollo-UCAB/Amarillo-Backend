import { DomainException } from "../../../common/domain/domain-exception/domain-exception";

export class InvalidProductName extends DomainException {
    constructor(msg: string) {
        super(msg);
    }
}