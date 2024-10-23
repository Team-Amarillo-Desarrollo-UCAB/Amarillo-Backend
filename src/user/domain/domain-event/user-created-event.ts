import { DomainEvent } from "src/common/domain/domain-event/domain-event.interface";
import { EnumUserRole } from "../user-role/user-role";

export class UserCreated extends DomainEvent{
    protected constructor(
        public userId: string,
        public userName: string,
        public userPhone: string,
        public userEmail: string,
        public userRole: EnumUserRole
    ) {
        super();
    }

    public static create(
        userId: string,
        userName: string,
        userPhone: string,
        userEmail: string,
        userRole: EnumUserRole
    ): UserCreated {
        return new UserCreated(
            userId,
            userName,
            userPhone,
            userEmail,
            userRole
        );
    }
}