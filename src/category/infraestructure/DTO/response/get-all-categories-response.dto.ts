import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsUUID } from "class-validator"

export class GetAllCategoriesResponseDTO{

    @IsUUID()
    id: string

    @ApiProperty({
        example: 'Familiar'
    })
    @IsString()
    name: string

    @ApiProperty({
        example: 'base64image',
    })
    @IsString()
    image?: string;


}