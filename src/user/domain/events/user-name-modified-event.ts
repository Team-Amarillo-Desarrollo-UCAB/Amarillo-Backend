import { DomainEvent } from "src/common/domain/domain-event/domain-event.interface";

export class UserNameModified extends DomainEvent {
    protected constructor(
        public userId: string,
        public userName: string,
    ) {
        super();
    }

    static create(id: string, name: string) {
        return new UserNameModified(id, name);
    }
}