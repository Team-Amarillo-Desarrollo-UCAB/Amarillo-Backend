import { AggregateRoot } from "src/common/domain/aggregate-root/aggregate-root";
import { DomainEvent } from "src/common/domain/domain-event/domain-event.interface";
import { EnumUserRole } from "./user-role/user-role";
import { UserCreated } from "./events/user-created-event";
import { InvalidUser } from "./domain-exception/invalid-user";
import { UserName } from "./value-object/user-name";
import { UserEmail } from "./value-object/user-email";
import { UserPhone } from "./value-object/user-phone";
import { UserId } from "./value-object/user-id";
import { UserRole } from "./value-object/user-role";
import { UserImage } from "./value-object/user-image";
import { UserNameModified } from "./events/user-name-modified-event";
import { UserEmailModified } from "./events/user-email-modified-event";
import { UserPhoneModified } from "./events/user-phone-modified-event";
import { CuponId } from "src/cupon/domain/value-objects/cupon-id";

export class User extends AggregateRoot<UserId> {

    private name: UserName;
    private email: UserEmail;
    private phone: UserPhone;
    private image: UserImage;
    private role: UserRole;
    private cupones: CuponId[] = []

    protected constructor(
        id: UserId,
        name: UserName,
        email: UserEmail,
        phone: UserPhone,
        image: UserImage,
        role: UserRole,
        cupones?: CuponId[]
    ) {
        const userCreated: UserCreated = UserCreated.create(
            id.Id,
            name.Name,
            phone.Phone,
            email.Email,
            image.Image,
            role.Role
        );
        super(id, userCreated);
        this.name = name
        this.email = email
        this.phone = phone
        this.image = image
        this.role = role
        cupones ? this.cupones = cupones : null
    }

    protected applyEvent(event: DomainEvent): void {
        switch (event.eventName) {
            //patron estado o estrategia
            case 'UserCreated':
                const userCreated: UserCreated = event as UserCreated;
                this.name = UserName.create(userCreated.userName)
                this.phone = UserPhone.create(userCreated.userPhone)
                this.email = UserEmail.create(userCreated.userEmail)
                this.role = UserRole.create(userCreated.userRole)
                this.image = UserImage.create(userCreated.userImage)
                break;
            case 'UserNameModified':
                const userNameModified: UserNameModified = event as UserNameModified;
                this.name = UserName.create(userNameModified.userName);
                break;
            case 'UserPhoneModified':
                const userPhoneModified: UserPhoneModified = event as UserPhoneModified;
                this.phone = UserPhone.create(userPhoneModified.userPhone);
                break;
            case 'UserEmailModified':
                const userEmailModified: UserEmailModified = event as UserEmailModified;
                this.email = UserEmail.create(userEmailModified.email);
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

    get Cupons(): CuponId[]{
        return this.cupones
    }

    public updateName(name: UserName): void {
        this.onEvent(UserNameModified.create(this.Id.Id, name.Name));
    }

    public updateEmail(email: UserEmail): void {
        this.onEvent(UserEmailModified.create(this.Id.Id, email.Email));
    }

    public updatePhone(phone: UserPhone): void {
        this.onEvent(UserPhoneModified.create(this.Id.Id, phone.Phone));
    }

    public addCupon(cupon: CuponId) {
        this.cupones.push(cupon)
    }

    static create(
        id: UserId,
        name: UserName,
        phone: UserPhone,
        email: UserEmail,
        image: UserImage,
        role: UserRole
    ): User {
        return new User(id, name, email, phone, image, role)
    }

    static createWithCupons(
        id: UserId,
        name: UserName,
        phone: UserPhone,
        email: UserEmail,
        image: UserImage,
        role: UserRole,
        cupones?: CuponId[]
    ): User {
        return new User(id, name, email, phone, image, role, cupones)
    }
}