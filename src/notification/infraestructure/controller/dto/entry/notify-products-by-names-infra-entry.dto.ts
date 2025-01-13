import { IsArray, IsString, ArrayNotEmpty, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class NotifyProductsByNamesServiceEntryInfrastructureDTO {
    @ApiProperty({
        description: 'Array of product names to notify (can be a single element)',
        isArray:true,
        example: ['Product1'], 
    })
    @IsNotEmpty() 
    @IsString({ each: true }) 
    products_names: string[];
}
