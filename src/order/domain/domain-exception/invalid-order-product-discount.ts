import { DomainException } from "../../../common/domain/domain-exception/domain-exception";

export class InvalidOrderProductDiscount extends DomainException {
    constructor(msg: string) {
        super(msg);
    }
}