import { DomainException } from "src/common/domain/domain-exception/domain-exception"

export class UserNotFoundException extends DomainException {
    constructor () {
        super( 'User not found' )
        Object.setPrototypeOf(this, UserNotFoundException.prototype)
    }
}