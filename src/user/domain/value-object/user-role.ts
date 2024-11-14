import { IValueObject } from "src/common/domain/value-object/value-object.interface";
import { EnumUserRole } from "../user-role/user-role";

export class UserRole implements IValueObject<UserRole>{

    protected constructor(
        private readonly role: EnumUserRole
    ){
        this.role = role
    }

    get Role(): EnumUserRole{
        return this.role
    }

    equals(valueObject: UserRole): boolean {
        return this.role === valueObject.Role
    }

    static create(role: EnumUserRole): UserRole{
        return new UserRole(role)
    }

}