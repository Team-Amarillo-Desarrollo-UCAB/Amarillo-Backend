import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class CreateReportEntryDTO {

    @ApiProperty({
        description: 'ID de la orden a reportar',
    })
    @IsString()
    @IsNotEmpty()
    id_orden: string

    @ApiProperty({
        description: 'Texto del reporte',
    })
    @IsString()
    @IsNotEmpty()
    texto: string

}