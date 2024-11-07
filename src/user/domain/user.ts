import { AggregateRoot } from "src/common/domain/aggregate-root/aggregate-root";
import { DomainEvent } from "src/common/domain/domain-event/domain-event.interface";
import { EnumUserRole } from "./user-role/user-role";
import { UserCreated } from "./domain-event/user-created-event";
import { InvalidUser } from "./domain-exception/invalid-user";
import { UserName } from "./value-object/user-name";
import { UserEmail } from "./value-object/user-email";
import { UserPhone } from "./value-object/user-phone";
import { UserId } from "./value-object/user-id";
import { UserRole } from "./value-object/user-role";
import { UserImage } from "./value-object/user-image";

export class User extends AggregateRoot<UserId> {

    private name: UserName;
    private email: UserEmail;
    private phone: UserPhone;
    private image: UserImage
    private role: UserRole;

    protected constructor(
        id: UserId,
        name: UserName,
        email: UserEmail,
        phone: UserPhone,
        image: UserImage,
        role: UserRole
    ) {
        /*const userCreated: UserCreated = UserCreated.create(
            id.Id,
            name.Name,
            phone.Phone,
            email.Email,
            role.Role
        );*/
        super(id);
        this.name = name
        this.email = email
        this.phone = phone
        this.image = image
        this.role = role
    }

    protected applyEvent(event: DomainEvent): void {
        switch (event.eventName) {
            //patron estado o estrategia, esto es una cochinada el switch case
            case 'UserCreated':
                const userCreated: UserCreated = event as UserCreated;
                this.name = UserName.create(userCreated.userName)
                this.phone = UserPhone.create(userCreated.userPhone)
                this.email = UserEmail.create(userCreated.userEmail)
                this.role = UserRole.create(userCreated.userRole)
                break;
        }
    }
    protected ensureValidState(): void {
        if (
            !this.name ||
            !this.phone ||
            !this.email ||
            !this.role ||
            !this.image
        )
            throw new InvalidUser('El usuario tiene que ser valido');
    }

    get Name(): string {
        return this.name.Name;
    }

    get Email(): string {
        return this.email.Email;
    }

    get Phone(): string {
        return this.phone.Phone;
    }

    get Role(): EnumUserRole {
        return this.role.Role
    }

    get Image(): string {
        return this.image.Image
    }

    static create(
        id: UserId,
        name: UserName,
        phone: UserPhone,
        email: UserEmail,
        image: UserImage,
        role: UserRole
    ): User {
        return new User(id, name, email, phone, image,role);
    }
}