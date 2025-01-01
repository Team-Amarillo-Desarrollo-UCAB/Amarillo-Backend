import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsUUID, Min, ValidateNested } from "class-validator";
import { BundleCurrency } from "src/bundle/domain/enum/bundle-currency-enum";
import { Measurement } from "src/common/domain/enum/commons-enums/measurement-enum";

export class UpdateBundleEntryDTO {
    @ApiProperty({
        example: "fb078b8f-b622-4292-9d94-b0bd71551162"
    })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    id: string;

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
        example: "$"
    })
    @IsOptional()
    currency?: string;

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
