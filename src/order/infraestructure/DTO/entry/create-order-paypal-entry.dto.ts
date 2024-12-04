import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";

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

export class CreateOrderPayPalEntryDTO {
    @ApiProperty({
        description: 'ID del metodo de pago',
    })
    @IsString()
    @IsNotEmpty()
    idPayment: string;

    @ApiProperty({
        description: 'Método de pago',
        example: 'credit',
    })
    @IsString()
    @IsNotEmpty()
    paymentMethod: string;

    @ApiProperty({
        description: 'Email de PayPal del usuario',
    })
    @IsString()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: 'Lista de productos asociados al pago',
        required: true,
        type: [ProductDto],
    })
    @IsArray()
    @IsNotEmpty()
    products: { id: string; quantity: number }[];
}