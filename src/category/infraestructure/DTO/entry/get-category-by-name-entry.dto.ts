import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class GetCategoryByNameEntryDTO{
    @ApiProperty({
        example: "Familiar"
    })
    @IsString()
    @IsNotEmpty()
    name: string
}