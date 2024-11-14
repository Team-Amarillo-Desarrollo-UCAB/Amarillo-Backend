import { IsNumber, IsString, IsUUID } from "class-validator"

export class GetAllProductsResponseDTO{

    @IsUUID()
    id_product: string

    @IsString()
    nombre: string

    @IsNumber()
    precio: number

    @IsString()
    moneda: string
    
    @IsNumber()
    stock: number

}