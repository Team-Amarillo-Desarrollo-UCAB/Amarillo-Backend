import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { EnumOrderEstados } from "src/order/domain/enum/order-estados-enum";

export class NotifyChangeStateOrderEntryInfrastructureDTO {

    @ApiProperty({
        example: 'CANCELLED',
    })
    @IsNotEmpty()
    @IsString()
    id: string

    @ApiProperty({
        example: 'CANCELLED',
    })
    @IsNotEmpty()
    @IsEnum(EnumOrderEstados)
    status: EnumOrderEstados
}
