import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class GetProductByNameEntryDTO{
    @ApiProperty({ required: false})
    @IsString()
    @IsNotEmpty()
    name: string
}