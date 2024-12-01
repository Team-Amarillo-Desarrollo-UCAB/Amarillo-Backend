import { DomainException } from "../../../common/domain/domain-exception/domain-exception";

export class InvalidProductUnit extends DomainException {
    constructor(msg: string) {
        super(msg);
    }
}