import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator"
import { EnumOrderEstados } from "src/order/domain/enum/order-estados-enum"
import { Moneda } from "src/product/domain/enum/Monedas"

export class CreateOrderResponseDTO {

    @ApiProperty({
        example: '550e8400-e29b-41d4-a716-446655440000'
    })
    @IsString()
    @IsNotEmpty()
    id: string

    @ApiProperty({
        example: EnumOrderEstados.CREADA,
        description: "Estado actual de la orden"
    })
    @IsEnum(EnumOrderEstados)
    @IsNotEmpty()
    orderState: string

    orderCreatedDate: Date

    @ApiProperty({
        example: "37",
        description: "Total de la compra"
    })
    @IsNumber()
    @IsNotEmpty()
    totalAmount: number

    @ApiProperty({
        example: "usd",
        description: "Moneda utilizada en la compra"
    })
    @IsEnum(Moneda)
    @IsNotEmpty()
    currency: string

    @ApiProperty({
        description: 'Dirección de la orden (latitud y longitud)',
        type: Object,
        properties: {
            lat: { type: 'number', example: 40.7128 },
            long: { type: 'number', example: -74.0060 },
        },
    })
    @ValidateNested()
    @Type(() => Object)
    @IsNotEmpty()
    orderDirection: {
        lat: number;
        long: number;
    };

    @ApiProperty({
        description: 'Lista de productos asociados a la orden',
        required: true,
    })
    @IsArray()
    @IsNotEmpty()
    @Type(() => Object)
    products: {
        id: string
        quantity: number
        nombre: string
        descripcion: string
        price: number
        currency: string
        images: string[]
    }[]

    @ApiProperty({
        description: 'Lista de combos asociados a la orden',
        required: true,
    })
    @IsArray()
    @IsNotEmpty()
    @Type(() => Object)
    bundles: {
        id: string,
        quantity: number
        nombre: string
        descripcion: string
        price: number
        currency: string
        images: string[]
    }[]

    orderReciviedDate?: Date

    @ApiProperty({
        example: 'La orden no fue correcta'
    })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    orderReport?: string

    @ApiProperty({
        description: 'Informacion del pago',
        required: true,
    })
    @IsArray()
    @IsNotEmpty()
    @Type(() => Object)
    orderPayment?: {
        amount: number,
        currency: string,
        paymentMethod: string
    }

}