import { IsString, IsNumber, IsArray, IsOptional, IsCurrency, IsInt, Min, IsPositive } from 'class-validator';

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

    @IsNumber()
    @IsPositive()
    weight: number;

    @IsString()
    measurement: string;

    @IsInt()
    @Min(0)
    stock: number;

    @IsArray()
    @IsString({ each: true })
    category: string[];

    @IsArray()
    @IsString({ each: true })
    productId: string[];

    @IsString()
    discount: string;
}
