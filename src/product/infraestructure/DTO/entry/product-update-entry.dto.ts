import { ApiProperty } from "@nestjs/swagger"
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, Min, ValidateNested } from "class-validator"

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
    @IsOptional()
    @IsString()
    name?: string

    @ApiProperty({
        example: 'El mejor queso del mundo'
    })
    @IsString()
    @IsOptional()
    @IsString()
    description?: string

    @ApiProperty({
        example: 'base64image []',
    })
    @IsOptional()
    @IsString()
    @IsArray()
    images?: string[]

    @ApiProperty({
        example: 2
    })
    @IsOptional()
    @IsNumber()
    price?: number

    @IsOptional()
    @IsString()
    currency?: string

    @IsOptional()
    @IsNumber()
    weight?: number

    @IsOptional()
    @IsString()
    measurement?: string

    @ApiProperty({
        example: 500
    })
    @IsOptional()
    @IsNumber()
    @Min(1)
    stock?: number

    @ApiProperty({
        description: 'Id de las categorias',
        type: [Object], // Especificamos que es un arreglo de objetos
        items: {
            type: 'object',
            properties: {
                id: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
            },
        },
    })
    @IsArray() // Aseguramos que sea un arreglo
    @ValidateNested({ each: true })
    category?: [
        {
            id: string
        }
    ]

}