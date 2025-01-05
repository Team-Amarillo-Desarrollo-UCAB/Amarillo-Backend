import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class CreateReportResponseDTO {

    @ApiProperty({
        description: 'ID de la orden a reportar',
    })
    @IsString()
    @IsNotEmpty()
    id_orden: string

    @ApiProperty({
        description: 'ID del reporte',
    })
    @IsString()
    @IsNotEmpty()
    id_reporte: string

}