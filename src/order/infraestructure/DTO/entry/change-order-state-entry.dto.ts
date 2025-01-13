import { ApiProperty } from "@nestjs/swagger"
import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator"
import { EnumOrderEstados } from "src/order/domain/enum/order-estados-enum"

export class ChangeOrderStateEntryDTO{

    @ApiProperty({
        example: EnumOrderEstados.CANCELED
    })
    @IsNotEmpty()
    @IsEnum(EnumOrderEstados)
    orderState: EnumOrderEstados

}