import { ApiProperty } from '@nestjs/swagger';

export class DeleteCategoryInfraResponseDto {
  @ApiProperty({
    description: 'ID de la categoria a eliminar - response',
    example: 'd92f1c4e-b134-4a1e-bb47-3e9c9c0f9a18',
  })
  id: string;
}