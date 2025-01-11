import { IsArray, IsString, ArrayNotEmpty } from 'class-validator';

export class NotifyProductsByNamesServiceEntryInfrastructureDTO {
    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    products_names: string[];
}
