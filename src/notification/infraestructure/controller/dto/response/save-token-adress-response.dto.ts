import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class SaveTokenAdressResponseDto {
    @ApiProperty({
        example: 'user-id-12312321'
    })
    userId: string
    @ApiProperty({
        example: 'token-tokwnq-12312321'
    })
    address: string
}