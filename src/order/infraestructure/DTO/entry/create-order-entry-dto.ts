import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsNumber, IsString } from "class-validator"

export class CreateOrderEntryDTO{

    @ApiProperty({
        example: '550e8400-e29b-41d4-a716-446655440000'
    })
    @IsString()
    @IsNotEmpty()
    id_producto: string

    @ApiProperty({
        example: 'Cheese Tris'
    })
    @IsString()
    @IsNotEmpty()
    nombre_producto: string

    @ApiProperty({
        example: 2
    })
    @IsNumber()
    @IsNotEmpty()
    cantidad_producto: number
}