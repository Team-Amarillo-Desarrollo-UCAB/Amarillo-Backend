import { ApplicationServiceEntryDto } from "src/common/application/application-services/DTO/application-service-entry.dto"
import { EnumUserRole } from "src/user/domain/user-role/user-role"


export class SignUpEntryDto implements ApplicationServiceEntryDto {
    userId: string
    email: string
    name: string
    phone: string
    image?: string
    password: string
    type: EnumUserRole
}