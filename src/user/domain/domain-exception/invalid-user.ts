import { DomainException } from "../../../common/domain/domain-exception/domain-exception";

export class InvalidUser extends DomainException {
    constructor(msg: string) {
        super(msg);
    }
}