import { User } from "src/user/domain/user";
import { UserEmail } from "src/user/domain/value-object/user-email";
import { UserId } from "src/user/domain/value-object/user-id";
import { UserName } from "src/user/domain/value-object/user-name";
import { UserPhone } from "src/user/domain/value-object/user-phone";
import { OrmUser } from "src/user/infraestructure/entities/orm-entities/user.entity";
import { UuidGeneratorMock } from "../other-mock/uuid-generator.mock";
import { EnumUserRole } from "src/user/domain/user-role/user-role";
import { UserImage } from "src/user/domain/value-object/user-image";
import { UserRole } from "src/user/domain/value-object/user-role";
import { UpdateUserProfileServiceEntryDto } from "src/user/application/DTO/params/update-user-profile-service-entry.dto";
import { UpdateUserProfileInfraServiceEntryDto } from "src/user/infraestructure/services/DTO/update-user-profile-infra-service-entry-dto";

export class UserObjectMother {

    private readonly accountUser: OrmUser

    constructor(accountUser: OrmUser) {
        this.accountUser = accountUser
    }

    static async createNormalUser() {
        const idGenerator = new UuidGeneratorMock()

        const normalUser = User.create(
            UserId.create(await idGenerator.generateId()),
            UserName.create('John Doe Doe'),
            UserPhone.create('04120145852'),
            UserEmail.create('bKQkZ@example.com'),
            UserImage.create(''),
            UserRole.create(EnumUserRole.CLIENT)
        )

        return normalUser;
    }

    static async createAdminUser() {
        const idGenerator = new UuidGeneratorMock()

        const normalUser = User.create(
            UserId.create(await idGenerator.generateId()),
            UserName.create('John Doe Doe'),
            UserPhone.create('04120145852'),
            UserEmail.create('bKQkZ@example.com'),
            UserImage.create(''),
            UserRole.create(EnumUserRole.ADMIN)
        )

        return normalUser;
    }


    static async createOrmUser() {
        const idGenerator = new UuidGeneratorMock()

        const normalOrmUser = OrmUser.create(
            await idGenerator.generateId(),
            'John Doe Doe',
            '04162235810',
            'bKQkZ@example.com',
            'example.txt',
            '"$2b$10$0kwGnnDmEJGmTg6O6u2QfOGBfd2QJ1PVJbdvpTJq7vn2KXaLu.1y6"',
            EnumUserRole.CLIENT
        )

        return normalOrmUser
    }

    async createOdmUser() {
        const idGenerator = new UuidGeneratorMock()

        const odmUser: OrmUser = OrmUser.create(
            await idGenerator.generateId(),
            'John Doe Doe',
            'example@gmail.com',
            'asdlkjfldsj;lmasd',
            null,
            '04166138440',
            EnumUserRole.CLIENT
        )
        return odmUser
    }

    static async updateEntryValid(id: UserId): Promise<UpdateUserProfileServiceEntryDto> {
        return {
            userId: id.Id,
            name: "Luigi",
            email: "test@gmail.com",
            phone: "04126138440",
        }
    }

    static async updateEntryInvalidName(id: UserId): Promise<UpdateUserProfileServiceEntryDto> {
        return {
            userId: id.Id,
            name: "L",
            email: "test@gmail.com",
            phone: "04126138440",
        }
    }

    static async updateEntryInvalidEmail(id: UserId): Promise<UpdateUserProfileServiceEntryDto> {
        return {
            userId: id.Id,
            name: "Luigi",
            email: "email",
            phone: "04126138440",
        }
    }

    static async updateEntryInvalidPhone(id: UserId): Promise<UpdateUserProfileServiceEntryDto> {
        return {
            userId: id.Id,
            name: "Luigi",
            email: "test@gmail.com",
            phone: "+58 123",
        }
    }

    static async updateInfraEntryValid(id: string): Promise<UpdateUserProfileInfraServiceEntryDto> {
        return {
            userId: id,
            password: 'hola2024',
            image: '',
        }
    }

}