import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

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
        example: 'PayPal',
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
    })
    @IsArray()
    @IsNotEmpty()
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
}