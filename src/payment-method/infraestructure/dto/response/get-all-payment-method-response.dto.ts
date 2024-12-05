import { IsBoolean, IsString, IsUUID } from "class-validator"

export class GetAllPaymentMethodsResponseDTO{

    @IsUUID()
    idPayment: string

    @IsString()
    name: string

    @IsBoolean()
    active: boolean

}