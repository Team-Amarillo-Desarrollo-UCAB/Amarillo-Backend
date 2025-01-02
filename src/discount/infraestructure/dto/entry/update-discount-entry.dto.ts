import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional, IsNumber, Min, IsDate } from "class-validator";

export class UpdateDiscountEntryDTO {


    @ApiProperty({
        example: 'Descuento de Año Nuevo'
    })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty({
        example: 'El mejor descuento del mundo'
    })
    @IsString()
    @IsOptional()
    description?: string;


    @ApiProperty({
        example: 0.15
    })
    @IsNumber()
    @Min(0.05)
    @IsOptional()
    percentage?: number;


    @ApiProperty({
        example: '"startDate": "2024-12-31T23:59:59.000Z"'
    })
    @IsOptional()
    @IsDate()
    startDate?: Date;

    @ApiProperty({
        example: '"deadline": "2024-12-31T23:59:59.000Z"'
    })
    @IsOptional()
    @IsDate()
    deadline?: Date;


    @ApiProperty({
        example: 'base64 url image'
    })
    @IsString()
    @IsOptional()
    image?: string;
}
