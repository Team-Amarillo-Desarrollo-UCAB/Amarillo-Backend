import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class RefundOrderResponseDTO {
    @ApiProperty({
        example: "550e8400-e29b-41d4-a716-446655440000",
    })
    @IsString()
    @IsNotEmpty()
    id_orden: string

    @ApiProperty({
        example: "550e8400-e29b-41d4-a716-446655440000",
    })
    @IsString()
    @IsNotEmpty()
    id_payment: string

    @ApiProperty({
        example: 20, // Ejemplo de latitud (por ejemplo, para Nueva York)
    })
    @IsNumber()
    @IsNotEmpty()
    monto_reembolsado: number;

    moneda?: string

}