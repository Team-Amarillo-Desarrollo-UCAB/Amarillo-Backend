import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class CreateReportEntryDTO {

    @ApiProperty({
        description: 'Texto del reporte',
    })
    @IsString()
    @IsNotEmpty()
    texto: string

}