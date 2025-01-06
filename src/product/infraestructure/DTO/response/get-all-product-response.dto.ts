import { IsArray, IsDate, IsNumber, IsOptional, IsPositive, IsString, IsUUID } from "class-validator"

export class GetAllProductsResponseDTO{

    @IsUUID()
    id: string

    @IsString()
    name: string

    @IsNumber()
    price: number

    @IsString()
    currency: string
    
    @IsNumber()
    stock: number
    
    @IsString()
    measurement: string

    @IsNumber()
    weight: number

    @IsString()
    description: string

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