import { ApiProperty } from "@nestjs/swagger"
import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator"
import { EnumOrderEstados } from "src/order/domain/enum/order-estados-enum"

export class ChangeOrderStateEntryDTO{

    @ApiProperty({
        example: '550e8400-e29b-41d4-a716-446655440000'
    })
    @IsString()
    @IsNotEmpty()
    id_order: string

    @ApiProperty({
        example: EnumOrderEstados.CANCELED
    })
    @IsNotEmpty()
    @IsEnum(EnumOrderEstados)
    orderState: EnumOrderEstados

}