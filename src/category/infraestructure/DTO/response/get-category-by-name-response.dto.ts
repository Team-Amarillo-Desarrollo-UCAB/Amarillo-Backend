import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsUUID } from "class-validator"

export class GetCategoryByNameResponseDTO{

    @IsUUID()
    categoryID: string

    @ApiProperty({
        example: 'Familiar'
    })
    @IsString()
    categoryName: string

    @ApiProperty({
        example: 'base64image',
    })
    @IsString()
    categoryImage?: string;


}