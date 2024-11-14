import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class GetCategoryResponseDTO{
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