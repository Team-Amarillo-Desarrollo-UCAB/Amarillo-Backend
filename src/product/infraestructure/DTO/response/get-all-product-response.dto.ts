import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDate, IsInt, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class GetAllProductsResponseDTO {

    @ApiProperty({
        type: String,
        description: 'Identificador único del producto',
        example: 'b5e4c79d-5d38-48a0-bdfd-fbfa54b3b7f7'
    })
    @IsUUID()
    id: string;

    @ApiProperty({
        type: String,
        description: 'Nombre del producto',
        example: 'Producto de prueba'
    })
    @IsString()
    name: string;

    @ApiProperty({
        type: Number,
        description: 'Precio del producto',
        example: 100
    })
    @IsNumber()
    price: number;

    @ApiProperty({
        type: String,
        description: 'Moneda en la que está el precio del producto (usd | bsf | eur)',
        example: 'usd'
    })
    @IsString()
    currency: string;

    @ApiProperty({
        type: Number,
        description: 'Cantidad disponible en stock',
        example: 50
    })
    @IsInt()
    @Min(0)
    stock: number;

    @ApiProperty({
        type: String,
        description: 'Unidad de medida del producto (kg,gr,mg,ml,lt,cm3)',
        example: 'kg'
    })
    @IsString()
    measurement: string;

    @ApiProperty({
        type: Number,
        description: 'Peso del producto',
        example: 1.5
    })
    @IsNumber()
    weight: number;

    @ApiProperty({
        type: String,
        description: 'Descripción del producto',
        example: 'Descripción detallada del producto'
    })
    @IsString()
    description: string;

    @ApiProperty({
        type: [String],
        description: 'Imágenes del producto',
        example: ['https://res.cloudinary.com/dxttqmyxu/image/upload/v1733187089/i4znbveyrzdibn7qliqy.webp', 'OtrosUrls'],
        required: false
    })
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    images?: string[];

    @ApiProperty({
        type: String,
        description: 'Fecha de caducidad del producto',
        example: '2025-12-31T00:00:00.000Z',
        required: false
    })
    @IsDate()
    @IsOptional()
    caducityDate?: Date;

    @ApiProperty({
        type: [String],
        description: 'ID de las categorías a las que pertenece el producto',
        example: ['UUIDCat1', 'UUIDCatN'],
        required: false
    })
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    categories?: string[];

    @ApiProperty({
        type: String,
        description: 'ID del Descuento aplicado al producto',
        example: 'UUIDDiscountX',
        required: false
    })
    @IsString()
    @IsOptional()
    discount?: string;

}
