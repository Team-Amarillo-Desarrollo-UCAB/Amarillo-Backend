import { DomainException } from 'src/common/domain/domain-exception/domain-exception';

export class InvalidUserPhone extends DomainException {
    constructor(msg: string) {
        super(msg);
    }
}