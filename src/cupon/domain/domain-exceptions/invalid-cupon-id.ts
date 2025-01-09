import { DomainException } from "../../../common/domain/domain-exception/domain-exception";

export class InvalidCuponId extends DomainException {
    constructor(msg: string) {
        super(msg);
    }
}