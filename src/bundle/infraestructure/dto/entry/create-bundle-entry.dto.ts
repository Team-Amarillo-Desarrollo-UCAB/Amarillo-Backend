import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsInt, IsNumber, IsOptional, IsPositive, IsString, IsArray } from "class-validator";

export class CreateBundleEntryDTO {

    @ApiProperty({
        example: 'Combo familiar'
    })
    @IsString()
    name: string;

    @ApiProperty({
        example: 'Este combo se describe como el mejor del mundo'
    })
    @IsString()
    description: string;

    @ApiProperty({
        example: 'base64image1, base64image2,...',
    })
    @IsArray()
    @IsString({ each: true })
    images: string[];

    @ApiProperty({
        example: '22',
    })
    @IsNumber()
    @IsPositive()
    price: number;

    @ApiProperty({
        example: 'usd | bsf | eur',
    })
    @IsString()
    currency: string;

    @ApiProperty({
        example: '22.5',
    })
    @IsNumber()
    @IsPositive()
    weight: number;

    @ApiProperty({
        example: '(kg,gr,mg,ml,lt,cm3)',
    })
    @IsString()
    measurement: string;

    @ApiProperty({
        example: '45',
    })
    @IsNumber()
    @IsPositive()
    @IsInt()
    stock: number;

    @ApiProperty({
        example: 'UUID1,UUID2,...',
    })
    @IsArray()
    @IsString({ each: true })
    category: string[];

    @ApiProperty({
        example: 'UUID1,UUID2,...',
    })
    @IsArray()
    @IsString({ each: true })
    productId: string[];

    @ApiProperty({
        example: '"caducityDate": "2024-12-31T23:59:59.000Z"'
    })
    @IsOptional() 
    @IsDate()      
    caducityDate?: Date;

    @ApiProperty({
        example: 'UUID'
    })
    @IsString()
    @IsOptional()
    discount?: string;
}
