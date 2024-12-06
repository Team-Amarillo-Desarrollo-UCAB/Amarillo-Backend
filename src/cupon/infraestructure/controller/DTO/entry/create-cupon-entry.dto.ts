import { IsDate, IsNumber, IsString, Min } from "class-validator"

export class CreateCuponEntryDto{
    @IsString()
    code: string

    @IsDate()
    expiration_date: Date

    @IsNumber()
    @Min(1)
    amount: number
}