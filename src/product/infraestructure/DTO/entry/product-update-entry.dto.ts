import { ApiProperty } from "@nestjs/swagger"
import { IsArray, IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsUUID, Min, ValidateNested } from "class-validator"
import { Moneda } from "src/product/domain/enum/Monedas"
import { UnidadMedida } from "src/product/domain/enum/UnidadMedida"

export class UpdateProductEntryDTO {

    @ApiProperty({
        example: "fb078b8f-b622-4292-9d94-b0bd71551162"
    })
    @IsString()
    @IsNotEmpty()
    id_producto: string

    @ApiProperty({
        example: 'Cheese Tris'
    })
    @IsString()
    nombre: string

    @ApiProperty({
        example: 'El mejor queso del mundo'
    })
    @IsString()
    descripcion: string

    @ApiProperty({
        example: "gm"
    })
    @IsEnum(UnidadMedida)
    unidad_medida: UnidadMedida

    @ApiProperty({
        example: 200
    })
    @IsNumber()
    cantidad_medida: number

    @ApiProperty({
        example: 2
    })
    @IsNumber()
    @Min(1)
    precio: number

    @ApiProperty({
        example: "$"
    })
    @IsEnum(Moneda)
    moneda: Moneda

    @ApiProperty({
        example: 500
    })
    @IsNumber()
    @Min(1)
    stock: number

    @ApiProperty({
        example: 'base64image',
    })
    @IsArray()
    @IsString({ each: true })
    images: string[];

    @ApiProperty({
        example: 'id de las categorias',
    })

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    category: string[];

    @ApiProperty({
        example: '"caducityDate": "2024-12-31T23:59:59.000Z"'
    })
    @IsOptional() 
    @IsDate()      
    caducityDate?: Date;

    @ApiProperty({
        example: 'UUID'
    })
    @IsString()
    @IsOptional()
    discount?: string;

}