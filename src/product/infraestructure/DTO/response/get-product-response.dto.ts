import { ApiProperty } from "@nestjs/swagger";

export class GetProductResponseDTO{
    @ApiProperty({
        example: 'Cheese Tris'
    })
    nombre: string

    @ApiProperty({
        example: 'El mejor queso del mundo'
    })
    descripcion: string

    @ApiProperty({
        example: "gm"
    })
    unidad_medida: string

    @ApiProperty({
        example: 200
    })
    cantidad_medida: number

    @ApiProperty({
        example: 2
    })
    precio: number

    @ApiProperty({
        example: "$"
    })
    moneda: string

    @ApiProperty({
        example: 500
    })
    stock: number

    @ApiProperty({
        example: "AGOTADO"
    })
    status?: string

    @ApiProperty({
        example: "https://res.cloudinary.com/dxttqmyxu/image/upload/v1731483047/kkizccq7zv9j37jg0hi3.png"
    })
    image?: string
}