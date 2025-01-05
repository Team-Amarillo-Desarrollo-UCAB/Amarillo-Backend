import { DomainException } from "../../../common/domain/domain-exception/domain-exception";

export class InvalidOrderBundleDiscount extends DomainException {
    constructor(msg: string) {
        super(msg);
    }
}