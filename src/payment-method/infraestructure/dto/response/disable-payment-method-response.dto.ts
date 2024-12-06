import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class DisablePaymentMethodResponseDTO{

    @ApiProperty({
      example: "550e8400-e29b-41d4-a716-446655440000",
    })
    @IsString()
    @IsNotEmpty()
    id_payment_method: string

}