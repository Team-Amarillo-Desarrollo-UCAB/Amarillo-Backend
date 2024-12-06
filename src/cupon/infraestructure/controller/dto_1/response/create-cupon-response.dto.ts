import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class CreateCuponResponseDto{
    @IsUUID()
    @ApiProperty({
      example: "24117a35-07b0-4890-a70f-a082c948b3d4",
    })
    cuponId: string
}