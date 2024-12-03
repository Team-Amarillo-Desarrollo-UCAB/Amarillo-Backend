import { ApplicationServiceEntryDto } from "src/common/application/application-services/dto/application-service-entry.dto"
import { EnumUserRole } from "src/user/domain/user-role/user-role"


export class SignUpEntryDto implements ApplicationServiceEntryDto {
    userId: string
    email: string
    name: string
    phone: string
    image: string
    password: string
    role: EnumUserRole
}