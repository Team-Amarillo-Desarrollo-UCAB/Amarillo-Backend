import { DomainException } from "../../../common/domain/domain-exception/domain-exception";

export class InvalidProductStock extends DomainException {
    constructor(msg: string) {
        super(msg);
    }
}