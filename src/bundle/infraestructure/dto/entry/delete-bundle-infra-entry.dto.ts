import { ApiProperty } from '@nestjs/swagger';

export class DeleteBundleInfraEntryDto {
  @ApiProperty({
    description: 'ID del combo a eliminar',
    example: 'd92f1c4e-b134-4a1e-bb47-3e9c9c0f9a18',
  })
  id: string;
}