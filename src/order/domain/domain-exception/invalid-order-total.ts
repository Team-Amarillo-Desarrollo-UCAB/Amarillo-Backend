import { DomainException } from "../../../common/domain/domain-exception/domain-exception";

export class InvalidOrderTotal extends DomainException {
    constructor(msg: string) {
        super(msg);
    }
}