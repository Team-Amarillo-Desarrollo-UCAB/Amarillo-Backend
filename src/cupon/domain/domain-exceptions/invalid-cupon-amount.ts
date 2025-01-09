import { DomainException } from "../../../common/domain/domain-exception/domain-exception";

export class InvalidCuponAmount extends DomainException {
    constructor(msg: string) {
        super(msg);
    }
}