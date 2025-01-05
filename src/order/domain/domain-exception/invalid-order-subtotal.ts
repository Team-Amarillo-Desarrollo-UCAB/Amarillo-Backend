import { DomainException } from "../../../common/domain/domain-exception/domain-exception";

export class InvalidOrderSubTotal extends DomainException {
    constructor(msg: string) {
        super(msg);
    }
}