import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNumber, IsString, Length, Min } from "class-validator";
import { UnidadMedida } from "src/product/domain/enum/UnidadMedida";

export class CreateProductEntryDTO {

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
    @IsString()
    @Length(1, 1)
    moneda: string

    @ApiProperty({
        example: 500
    })
    @IsNumber()
    @Min(1)
    stock: number

    @ApiProperty({
        example: 'base64image',
    })
    @IsString()
    image?: string;

}