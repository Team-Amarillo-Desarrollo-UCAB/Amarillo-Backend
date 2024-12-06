import { DomainEvent } from "src/common/domain/domain-event/domain-event.interface";
export class UserEmailModified extends DomainEvent {
    protected constructor(
        public id: string,
        public email: string,
    ) {
        super();
    }

    static create(id: string, email: string) {
        return new UserEmailModified(id, email);
    }
}