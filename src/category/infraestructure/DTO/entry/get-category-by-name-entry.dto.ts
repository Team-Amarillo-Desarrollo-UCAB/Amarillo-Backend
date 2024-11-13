import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class GetCategoryByNameEntryDTO{
    @ApiProperty({
        example: "Cheese Tris"
    })
    @IsString()
    @IsNotEmpty()
    name: string
}