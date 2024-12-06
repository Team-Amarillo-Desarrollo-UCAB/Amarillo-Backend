import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class DeleteProductEntryDTO{

    @ApiProperty({
        example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
    })
    @IsString()
    @IsNotEmpty()
    id: string

}