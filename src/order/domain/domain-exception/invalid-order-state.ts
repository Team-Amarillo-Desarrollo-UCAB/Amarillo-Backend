import { DomainException } from "../../../common/domain/domain-exception/domain-exception";

export class InvalidOrderState extends DomainException {
    constructor(msg: string) {
        super(msg);
    }
}