import { ApiProperty } from "@nestjs/swagger";
import { IsString} from "class-validator";

export class CreateCategoryEntryDTO {

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