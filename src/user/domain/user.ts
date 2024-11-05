import { AggregateRoot } from "src/common/domain/aggregate-root/aggregate-root";
import { DomainEvent } from "src/common/domain/domain-event/domain-event.interface";
import { EnumUserRole } from "./user-role/user-role";
import { UserCreated } from "./domain-event/user-created-event";
import { InvalidUser } from "./domain-exception/invalid-user";

export class User extends AggregateRoot<string> {

    private name: string;
    private email: string;
    private phone: string;
    private role: EnumUserRole;

    protected constructor(
        id: string,
        name: string,
        email: string,
        phone: string,
        role: EnumUserRole
    ) {
        const userCreated: UserCreated = UserCreated.create(
            id,
            name,
            phone,
            email,
            role
        );
        super(id, userCreated);
    }

    protected applyEvent(event: DomainEvent): void {
        switch (event.eventName) {
            //patron estado o estrategia, esto es una cochinada el switch case
            case 'UserCreated':
                const userCreated: UserCreated = event as UserCreated;
                this.name = userCreated.userName
                this.phone = userCreated.userPhone
                this.email = userCreated.userEmail
                this.role = userCreated.userRole
                break;
        }
    }
    protected ensureValidState(): void {
        if (
            !this.name ||
            !this.phone ||
            !this.email ||
            !this.role
        )
            throw new InvalidUser('El usuario tiene que ser valido');
    }

    get Name(): string {
        return this.name;
    }

    get Email(): string {
        return this.email;
    }

    get Phone(): string {
        return this.phone;
    }

    get Role(): EnumUserRole {
        return this.role
    }

    static create(
        id: string,
        name: string,
        phone: string,
        email: string,
        role: EnumUserRole
    ): User {
        return new User
        (
            id, 
            name, 
            phone, 
            email,
            role
        );
    }
}