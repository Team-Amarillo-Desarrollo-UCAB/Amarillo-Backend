import { DomainException } from "../../../common/domain/domain-exception/domain-exception";

export class InvalidOrderDiscount extends DomainException {
    constructor(msg: string) {
        super(msg);
    }
}