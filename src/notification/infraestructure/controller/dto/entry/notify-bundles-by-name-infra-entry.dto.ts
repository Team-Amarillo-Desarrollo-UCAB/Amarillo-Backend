import { IsArray, IsString, ArrayNotEmpty, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BundleStock } from '../../../../../bundle/domain/value-objects/bundle-stock';

export class NotifyBundlesByNamesServiceEntryInfrastructureDTO {
    @ApiProperty({
        description: 'Array of bundle names to notify (can be a single element)',
        isArray:true,
        example: ['Product1'], 
    })
    @IsNotEmpty() 
    @IsString({ each: true }) 
    bundles_names: string[];
}
