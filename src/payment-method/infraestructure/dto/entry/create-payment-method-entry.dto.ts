import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean, IsEnum } from "class-validator"
import { EnumPaymentMethod } from "src/payment-method/domain/enum/PaymentMethod"

export class CreatePaymentMethodEntryDTO {

    @ApiProperty({
        example: 'PayPal',
    })
    @IsEnum(EnumPaymentMethod)
    name: EnumPaymentMethod

    @ApiProperty({
        example: 'true',
    })
    @IsBoolean()
    active: boolean

}