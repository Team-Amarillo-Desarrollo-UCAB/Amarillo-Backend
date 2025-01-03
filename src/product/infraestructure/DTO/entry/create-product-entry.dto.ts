import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsDate, IsEnum, IsNumber, IsOptional, IsString, Min } from "class-validator";
import { Moneda } from "src/product/domain/enum/Monedas";
import { UnidadMedida } from "src/product/domain/enum/UnidadMedida";

export class CreateProductEntryDTO {

    @ApiProperty({
        example: 'Cheese Tris'
    })
    @IsString()
    name: string

    @ApiProperty({
        example: 'El mejor queso del mundo'
    })
    @IsString()
    description: string

    @ApiProperty({
        example: 'base64image',
    })
    @IsArray()
    @IsString({ each: true })
    images: string[];

    @ApiProperty({
        example: 2
    })
    @IsNumber()
    @Min(1)
    price: number

    @ApiProperty({
        example: "usd"
    })
    @IsEnum(Moneda)
    currency: Moneda

    @ApiProperty({
        example: 200
    })
    @IsNumber()
    weight: number

    @ApiProperty({
        example: "gr"
    })
    @IsEnum(UnidadMedida)
    measurement: UnidadMedida

    @ApiProperty({
        example: 500
    })
    @IsNumber()
    @Min(1)
    stock: number

    @ApiProperty({
        example: 'id de las categorias',
    })

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    category: {id: string}[];

    @ApiProperty({
        example: 'UUID'
    })
    @IsString()
    @IsOptional()
    discount?: string;

    @ApiProperty({
        example: '"caducityDate": "2024-12-31T23:59:59.000Z"'
    })
    @IsDate()
    @IsOptional()
    caducityDate?: Date

}