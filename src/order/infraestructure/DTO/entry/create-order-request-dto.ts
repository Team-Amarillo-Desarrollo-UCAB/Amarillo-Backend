import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateOrderEntryDTO } from './create-order-entry-dto';

export class CreateOrderRequestDTO {
  @ApiProperty({
    type: [CreateOrderEntryDTO], // Indica que es un array de CreateOrderEntryDTO
    description: 'Array de entradas para crear una orden',
  })
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderEntryDTO) // Convierte cada elemento a CreateOrderEntryDTO
  entry: CreateOrderEntryDTO[];
}