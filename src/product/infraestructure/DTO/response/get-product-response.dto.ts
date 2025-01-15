import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, Min, IsOptional, IsArray, IsString, IsDate } from "class-validator";
import { Moneda } from "src/product/domain/enum/Monedas";
import { UnidadMedida } from "src/product/domain/enum/UnidadMedida";

export class GetProductResponseDTO{

    @IsString()
    id: string;
    
    @ApiProperty({
        example: 'Cheese Tris'
    })
    name: string

    @ApiProperty({
        example: 2
    })
    price: number

    @ApiProperty({
        example: "$"
    })
    currency: string

    @ApiProperty({
        example: 500
    })
    stock: number

    @ApiProperty({
        example: "gm"
    })
    measurement: string

    @ApiProperty({
        example: 200
    })
    weight: number

    @ApiProperty({
        example: 'El mejor queso del mundo'
    })
    description: string

    @ApiProperty({
        example: "https://res.cloudinary.com/dxttqmyxu/image/upload/v1731483047/kkizccq7zv9j37jg0hi3.png"
    })
    images: string[]

    @ApiProperty({
        example: '"caducityDate": "2024-12-31T23:59:59.000Z"'
    })
    @IsDate()
    @IsOptional()
    caducityDate?: Date

    @ApiProperty({
        example: 'id de las categorias',
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    categories?: string[];

    @ApiProperty({
        example: 'UUID'
    })
    @IsString()
    @IsOptional()
    discount?: string;

    @ApiProperty({
        example: 'cloudinaryURL'
    })
    @IsString()
    @IsOptional()
    image3d?: string;

}