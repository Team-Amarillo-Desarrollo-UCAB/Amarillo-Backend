import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsArray, IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min, ValidateNested } from "class-validator";
import { EnumOrderEstados } from "src/order/domain/enum/order-estados-enum";

export class GetAllOrdersReponseDTO {


    @ApiProperty({
        example: "fb078b8f-b622-4292-9d94-b0bd71551162"
    })
    @IsString()
    @IsNotEmpty()
    id: string;

    @ApiProperty({
        description: 'Estado de la orden',
        enum: EnumOrderEstados,
        example: EnumOrderEstados.CREADA, // Cambia según el ejemplo adecuado
    })
    @IsEnum(EnumOrderEstados)
    orderState: EnumOrderEstados;

    @ApiProperty({
        example: "2022-01-01T00:00:00.000Z"
    })
    @IsDate()
    @IsNotEmpty()
    orderCreatedDate: Date;

    @ApiProperty({
        example: 20
    })
    @IsNumber()
    @IsNotEmpty()
    totalAmount: number;

    @ApiProperty({
        example: 20
    })
    @IsNumber()
    @IsNotEmpty()
    @IsOptional()
    sub_total?: number;

    @ApiProperty({
        example: 20
    })
    @IsNumber()
    @IsNotEmpty()
    shipping_fee: number;

    @ApiProperty({
        example: "USD"
    })
    @IsString()
    @IsNotEmpty()
    currency: string;

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
        example: "Universidad Catolica Andres Bello"
    })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    directionName?: string;

    @ApiProperty({
        description: 'Detalles de los productos en la orden',
        type: [Object],
        items: {
            type: 'object',
            properties: {
                id: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
                quantity: { type: 'number', example: 2 },
            },
        },
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Object)
    products: {
        id: string;
        quantity: number;
    }[];

    @ApiProperty({
        description: 'Detalles de los bundles en la orden',
        type: [Object],
        items: {
            type: 'object',
            properties: {
                id: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
                quantity: { type: 'number', example: 2 },
            },
        },
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Object)
    bundles: {
        id: string;
        quantity: number;
    }[];

    @ApiProperty({
        example: "2022-01-01T00:00:00.000Z",
        required: false,
    })
    @IsDate()
    @IsOptional()
    orderReciviedDate?: Date;

    @ApiProperty({
        example: "Informe de la orden",
        required: false,
    })
    @IsString()
    @IsOptional()
    orderReport?: string;

    @ApiProperty({
        description: 'Detalles del pago de la orden',
        type: Object,
        required: false,
        properties: {
            amount: { type: 'number', example: 20 },
            currency: { type: 'string', example: 'USD' },
            paymentMethod: { type: 'string', example: 'PayPal' },
        },
    })
    @IsOptional()
    @ValidateNested()
    @Type(() => Object)
    orderPayment?: {
        amount: number;
        currency: string;
        paymentMethod: string;
    };

    @ApiProperty({
        example: 20
    })
    @IsNumber()
    @Min(0)
    @IsNotEmpty()
    @IsOptional()
    orderDiscount?: number;
}