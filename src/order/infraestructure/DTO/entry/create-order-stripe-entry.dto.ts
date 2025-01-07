import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";
import { PaymentMethod } from "src/payment-method/domain/payment-method";

class ProductDto {
    @ApiProperty({ description: 'ID del producto', type: String })
    @IsString()
    @IsNotEmpty()
    id: string;

    @ApiProperty({ description: 'Cantidad del producto', type: Number })
    @IsNumber()
    @IsNotEmpty()
    quantity: number;
}

export class CreateOrderStripeEntryDTO {
    @ApiProperty({
        description: 'ID del metodo de pago',
    })
    @IsString()
    @IsNotEmpty()
    idPayment: string;

    @ApiProperty({
        description: 'Token generado para stripe',
        example: "pm_card_threeDSecureOptional",
        default: "pm_card_visa"
    })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    token?: string = "pm_card_visa"

    @ApiProperty({
        description: 'Método de pago',
        example: 'credit',
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
        type: [ProductDto],
    })
    @IsArray()
    @IsNotEmpty()
    @IsOptional()
    products?: { id: string; quantity: number }[];

    @ApiProperty({
        description: 'Lista de combos asociados al pago',
        type: [ProductDto],
    })
    @IsArray()
    @IsNotEmpty()
    @IsOptional()
    bundles?: { id: string; quantity: number }[]

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