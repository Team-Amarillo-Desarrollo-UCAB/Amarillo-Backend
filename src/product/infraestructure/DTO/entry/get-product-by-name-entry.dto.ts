import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class GetProductByNameEntryDTO{
    @ApiProperty({
        example: "Cheese Tris"
    })
    @IsString()
    @IsNotEmpty()
    name: string
}