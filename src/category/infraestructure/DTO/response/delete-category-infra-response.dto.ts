// src/category/infrastructure/dto/response/delete-category-infra-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class DeleteCategoryInfraResponseDto {
  @ApiProperty({
    description: 'ID de la categoría eliminada',
    example: 'd92f1c4e-b134-4a1e-bb47-3e9c9c0f9a18',
  })
  deletedId: string; // ID de la categoría eliminada

  @ApiProperty({
    description: 'Mensaje de éxito tras la eliminación',
    example: 'Categoría eliminada exitosamente.',
  })
  message: string; // Mensaje de confirmación
}
