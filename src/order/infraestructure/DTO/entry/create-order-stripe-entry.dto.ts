import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
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
}