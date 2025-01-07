import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEnum, IsNotEmpty } from "class-validator";
import { EnumOrderEstados } from "src/order/domain/enum/order-estados-enum";

export class GetAllOrdersEntryDTO {

    @ApiProperty({
        example: "CREATED",
        description: 'Status of the orders',
        isArray: true, // Esto indica que es un array en la documentación
    })
    @IsNotEmpty({ each: true })
    @IsEnum(EnumOrderEstados, { each: true })
    status: EnumOrderEstados[]

}