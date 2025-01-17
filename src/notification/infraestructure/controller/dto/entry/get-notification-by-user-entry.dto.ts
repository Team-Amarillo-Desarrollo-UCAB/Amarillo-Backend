import { IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class GetNotificationsUserDto {
    @ApiProperty({
        description: "Número de la página que se desea consultar.",
        example: 1,
        default: 1,
    })
    @IsNumber()
    page: number = 1;

    @ApiProperty({
        description: "Cantidad de notificaciones por página.",
        example: 10,
        default: 10,
    })
    @IsNumber()
    perPage: number = 10;
}
