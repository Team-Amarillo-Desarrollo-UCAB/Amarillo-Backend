import { DomainException } from "../../../common/domain/domain-exception/domain-exception";

export class InvalidOrderShippingFee extends DomainException {
    constructor(msg: string) {
        super(msg);
    }
}