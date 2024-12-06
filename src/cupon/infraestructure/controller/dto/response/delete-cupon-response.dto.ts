// src/category/infrastructure/dto/response/delete-category-infra-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class DeleteCouponResponseDto {
  @ApiProperty({
    description: 'ID del cupón eliminado',
    example: 'd92f1c4e-b134-4a1e-bb47-3e9c9c0f9a18',
  })
  deletedId: string; 

  @ApiProperty({
    description: 'Mensaje de éxito tras la eliminación',
    example: 'Cupón eliminado exitosamente.',
  })
  message: string; 
}
