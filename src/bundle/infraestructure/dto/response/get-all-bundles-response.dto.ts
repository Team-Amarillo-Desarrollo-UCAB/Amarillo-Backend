import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsArray, IsOptional, IsCurrency, IsInt, Min, IsPositive, IsDate } from 'class-validator';

export class GetAllBundlesResponseDTO {
    @IsString()
    id: string;

    @IsString()
    name: string;

    @IsArray()
    @IsString({ each: true })
    images: string[];

    @IsNumber()
    @IsPositive()
    price: number;

    @IsString()
    currency: string;



    @ApiProperty({ type: Number })
    @IsNumber()
    @IsPositive()
    weight: number;

    @IsString()
    measurement: string;

    @IsInt()
    @Min(0)
    stock: number;

    @IsDate()
    @IsOptional()
    caducityDate?:Date

    @IsArray()
    @IsString({ each: true })
    categories: string[];

    @IsArray()
    @IsString({ each: true })
    products: string[];

    @IsString()
    @IsOptional()
    discount?: string;
}
