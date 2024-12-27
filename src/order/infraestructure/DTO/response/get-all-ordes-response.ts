import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsDate, IsEnum, IsNotEmpty, IsNumber, IsString, ValidateNested } from "class-validator";
import { EnumOrderEstados } from "src/order/domain/enum/order-estados-enum";

export class GetAllOrdersReponseDTO {


    @ApiProperty({
        example: "fb078b8f-b622-4292-9d94-b0bd71551162"
    })
    @IsString()
    @IsNotEmpty()// Convierte cada elemento a CreateOrderEntryDTO
    id_orden: string;

    @ApiProperty({
        example: "2022-01-01T00:00:00.000Z",
        enum: EnumOrderEstados,
    })
    @IsEnum(EnumOrderEstados)
    estado: EnumOrderEstados

    // TODO: Buscar otra forma si es posible
    @ApiProperty({
        description: 'Detalles de los productos en la orden',
        type: [Object], // Especificamos que es un arreglo de objetos
        items: {
            type: 'object',
            properties: {
                id_producto: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
                nombre_producto: { type: 'string', example: 'Cheese Tris' },
                cantidad_producto: { type: 'number', example: 2 },
            },
        },
    })
    @IsArray() // Aseguramos que sea un arreglo
    @ValidateNested({ each: true }) // Validación de los elementos dentro del arreglo
    productos: {
        id_producto: string;
        nombre_producto: string
        cantidad_producto: number;
    }[];

    // TODO: Buscar otra forma si es posible
    @ApiProperty({
        description: 'Detalles de los productos en la orden',
        type: [Object], // Especificamos que es un arreglo de objetos
        items: {
            type: 'object',
            properties: {
                id_combo: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
                nombre_combo: { type: 'string', example: 'Combo de cervezas' },
                cantidad_combo: { type: 'number', example: 2 },
            },
        },
    })
    @IsArray() // Aseguramos que sea un arreglo
    @ValidateNested({ each: true }) // Validación de los elementos dentro del arreglo
    combos: {
        id_combo: string;
        nombre_combo: string;
        cantidad_combo: number
    }[];

    @ApiProperty({
        example: 20
    })
    @IsNumber()
    monto_total: number

    @ApiProperty({
        example: "2022-01-01T00:00:00.000Z"
    })
    @IsDate()
    fecha_creacion: Date
}