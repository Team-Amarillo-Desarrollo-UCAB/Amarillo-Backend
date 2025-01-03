import { ApiProperty } from '@nestjs/swagger';

export class DeleteDiscountResponseDTO {
  @ApiProperty({
    description: 'ID del descuento a eliminar - response',
    example: 'd92f1c4e-b134-4a1e-bb47-3e9c9c0f9a18',
  })
  id: string;
}