import { IsDate, isNumber, IsNumber, IsString, IsUUID } from "class-validator"

export class GetAllCouponsResponseDTO{

    @IsUUID()
    id_cupon: string

    @IsString()
    code: string

    @IsDate()
    expiration_date: Date

    @IsNumber()
    amount: number

}