import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive, IsString, Min } from 'class-validator';

export class PaginationDto {
  @ApiProperty({ required: false, default: 10, minimum: 1 })
  @IsOptional()
  @IsPositive()
  @IsNumber()
  //@Type(() => Number) // enableImplicitConversions: true
  perpage?: number = 10;

  @ApiProperty({ required: false, default: 1, minimum: 1 })
  @IsOptional()
  @Min(1, { message: 'El valor de page debe ser al menos 1' }) // Validación estricta
  @IsPositive()
  @IsNumber()
  //@Type(() => Number) // enableImplicitConversions: true
  page?: number = 1;
}
