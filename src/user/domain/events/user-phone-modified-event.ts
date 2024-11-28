import { DomainEvent } from "src/common/domain/domain-event/domain-event.interface";

export class UserPhoneModified extends DomainEvent {
    protected constructor(
        public userId: string,
        public userPhone: string,
    ) {
        super();
    }

    static create(id: string, phone: string) {
        return new UserPhoneModified(id, phone);
    }
}