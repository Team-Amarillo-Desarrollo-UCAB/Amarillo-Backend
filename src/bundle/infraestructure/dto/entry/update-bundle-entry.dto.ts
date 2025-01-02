import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsUUID, Min, ValidateNested } from "class-validator";
import { Bundle } from "src/bundle/domain/bundle.entity";
import { BundleCurrency } from "src/bundle/domain/enum/bundle-currency-enum";
import { Measurement } from "src/common/domain/enum/commons-enums/measurement-enum";

export class UpdateBundleEntryDTO {


    @ApiProperty({
        example: 'Cheese Tris'
    })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty({
        example: 'El mejor queso del mundo'
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        example: 'base64image',
    })
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    images?: string[];

    @ApiProperty({
        example: 2
    })
    @IsNumber()
    @Min(1)
    @IsOptional()
    price?: number;

    @ApiProperty({
        example: "usd | bsf | eur"
    })
    @IsOptional()
    @IsEnum(BundleCurrency)
    currency?: BundleCurrency;

    @ApiProperty({
        example: 200
    })
    @IsNumber()
    @IsOptional()
    weight?: number;

    @ApiProperty({
        example: "gm"
    })
    @IsEnum(Measurement)
    @IsOptional()
    measurement?: Measurement;

    @ApiProperty({
        example: 500
    })
    @IsNumber()
    @Min(1)
    @IsOptional()
    stock?: number;

    @ApiProperty({
        example: 'id de las categorias',
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    category?: string[];

    @ApiProperty({
        example: '"caducityDate": "2024-12-31T23:59:59.000Z"'
    })
    @IsOptional()
    @IsDate()
    caducityDate?: Date;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    productId?: string[];

    @ApiProperty({
        example: 'UUID'
    })
    @IsString()
    @IsOptional()
    discount?: string;
}
