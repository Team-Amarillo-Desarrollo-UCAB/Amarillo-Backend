import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

export class CreateOrderCashEntryDTO {
    @ApiProperty({
        description: 'ID del metodo de pago',
    })
    @IsString()
    @IsNotEmpty()
    idPayment: string;

    @ApiProperty({
        description: 'Método de pago',
        example: 'PayPal',
    })
    @IsString()
    @IsNotEmpty()
    paymentMethod: string;

    @ApiProperty({
        example: "2025-01-05",
    })
    @IsString()
    @IsNotEmpty()
    orderReciviedDate: string

    @ApiProperty({
        example: "Universidad Catolica Andres Bello",
    })
    @IsString()
    @IsNotEmpty()
    ubicacion: string

    @ApiProperty({
        example: 40.7128, // Ejemplo de latitud (por ejemplo, para Nueva York)
    })
    @IsNumber()
    @IsNotEmpty()
    @Min(-90)   // Mínimo valor de latitud
    @Max(90)    // Máximo valor de latitud
    latitud: number;

    @ApiProperty({
        example: -74.0060, // Ejemplo de longitud (por ejemplo, para Nueva York)
    })
    @IsNumber()
    @IsNotEmpty()
    @Min(-180)  // Mínimo valor de longitud
    @Max(180)   // Máximo valor de longitud
    longitud: number;

    @ApiProperty({
        description: 'Lista de productos asociados al pago',
        required: true,
    })
    @IsArray()
    @IsNotEmpty()
    @IsOptional()
    @Type(() => Object) // Aquí transformamos los objetos en una forma estándar sin necesidad de un DTO adicional
    products?: { id: string; quantity: number }[];

    @ApiProperty({
        description: 'Lista de combos asociados al pago',
        type: [Object],
    })
    @IsArray()
    @IsNotEmpty()
    @IsOptional()
    @Type(() => Object) // Aquí igualmente, transformamos los objetos en una forma estándar
    bundles?: { id: string; quantity: number }[];

    @ApiProperty({
        description: 'Codigo del cupon a aplicar en la orden',
        example: "qwerty"
    })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    cupon_code?: string

    @ApiProperty({
        description: 'Instrucciones de la orden',
        example: "Entregar por la puerta roja de la esquina"
    })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    instructions?: string

}