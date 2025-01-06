import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsPositive, IsString,IsArray} from 'class-validator';

export class ProductParamsEntryDTO {

    @IsOptional()
    @IsString({ each: true })
    @ApiProperty({ required: false})
    category?: string[];  

    @IsOptional()
    @IsString()
    @ApiProperty({ required: false})
    name?: string;
    
    @IsOptional()
    @IsInt()
    @IsPositive()
    @ApiProperty({ required: false})
    price?: number;

    @IsOptional()
    @IsString()
    @ApiProperty({ required: false})
    popular?: string;
    
    @IsOptional()
    @IsString()
    @ApiProperty({ required: false})
    discount?: string;  
}