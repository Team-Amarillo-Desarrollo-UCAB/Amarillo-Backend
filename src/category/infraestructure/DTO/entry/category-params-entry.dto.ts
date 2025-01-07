import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString} from 'class-validator';

export class CategoryParamsEntryDTO {
    @IsOptional()
    @IsString()
    @ApiProperty({ required: false})
    name?: string;  // Filtrar por nombre
    
    @IsOptional()
    @IsString()
    @ApiProperty({ required: false})
    discount?: string;  // Filtrar por descuento
}

