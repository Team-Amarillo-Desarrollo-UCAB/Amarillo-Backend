import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsPositive, IsString, Min } from 'class-validator';

export class PaginationDto {
  @ApiProperty({ required: false, default: 10, minimum: 1 })
  @IsOptional()
  @IsPositive()
  @Type(() => Number) // enableImplicitConversions: true
  limit?: number = 10;

  @ApiProperty({ required: false, default: 1, minimum: 1 })
  @IsOptional()
  @Min(1, { message: 'El valor de page debe ser al menos 1' }) // Validación estricta
  @Type(() => Number) // enableImplicitConversions: true
  page?: number = 1;
}
