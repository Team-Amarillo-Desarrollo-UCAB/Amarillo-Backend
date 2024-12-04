import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString} from "class-validator";

export class UpdateCategoryEntryDTO {

    @ApiProperty({
        example: 'Familiar'
    })
    @IsString()
    @IsOptional()
    name?: string

    @ApiProperty({
        example: 'base64image',
    })
    @IsString()
    @IsOptional()
    icon?: string;


}