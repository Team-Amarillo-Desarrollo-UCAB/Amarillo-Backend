import { DomainException } from "../../../common/domain/domain-exception/domain-exception";

export class InvalidOrderReportId extends DomainException {
    constructor(msg: string) {
        super(msg);
    }
}