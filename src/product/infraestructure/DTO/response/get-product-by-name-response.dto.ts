import { ApiProperty } from "@nestjs/swagger"

export class GetProductByNameResponseDTO{

    @ApiProperty({
        example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
    })
    id_producto: string

    @ApiProperty({
        example: 'Cheese Tris'
    })
    nombre: string

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
        example: "gm"
    })
    unidad_medida: string

    @ApiProperty({
        example: 200
    })
    cantidad_medida: number

    @ApiProperty({
        example: 'El mejor queso del mundo'
    })
    descripcion: string


    @ApiProperty({
        example: "https://res.cloudinary.com/dxttqmyxu/image/upload/v1731614522/bzrj2nraiiz4gbqzsapn.jpg"
    })
    images?: string[]

    @ApiProperty({
        example: 'FECHA'
    })
    caducityDate?:Date

    @ApiProperty({
        example: "ID CATEGORIAS"
    })
    category?: string[];

    @ApiProperty({
        example: "ID DEL DESCUENTO"
    })
    discount?: string





}