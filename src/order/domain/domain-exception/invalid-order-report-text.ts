import { DomainException } from "../../../common/domain/domain-exception/domain-exception";

export class InvalidOrderReportText extends DomainException {
    constructor(msg: string) {
        super(msg);
    }
}