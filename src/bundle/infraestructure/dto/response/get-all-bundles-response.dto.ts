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

    // Al usr descuentos en algún momento, descomentar la siguiente parte y agregar validación.
    // @IsArray() 
    // @ArrayMinSize(1) // 
    // @ValidateNested({ each: true }) // Si los descuentos son objetos, valida cada uno
    // discount: [{
    //     @IsString() 
    //     id: string;

    //     @IsNumber()
    //     @Min(0) 
    //     percentage: number; 
    // }];
}
