import { DomainException } from "../../../common/domain/domain-exception/domain-exception";

export class InvalidOrder extends DomainException {
    constructor(msg: string) {
        super(msg);
    }
}