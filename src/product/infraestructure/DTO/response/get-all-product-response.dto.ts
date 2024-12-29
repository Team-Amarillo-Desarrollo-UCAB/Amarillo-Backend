import { IsArray, IsDate, IsNumber, IsOptional, IsPositive, IsString, IsUUID } from "class-validator"

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
    
    @IsString()
    unidad_medida: string

    @IsNumber()
    cantidad_medida: number

    @IsString()
    descripcion: string

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    images?: string[]

    @IsDate()
    @IsOptional()
    caducityDate?:Date

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    category?: string[];

    @IsString()
    @IsOptional()
    discount?: string;


}