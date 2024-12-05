import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNumber, IsDate } from "class-validator";

export class GetDiscountResponseDTO {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Identificador único del descuento'
  })
  @IsString()
  id: string;

  @ApiProperty({
    example: 'Descuento de Navidad',
    description: 'Nombre del descuento'
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Descuento aplicable a productos seleccionados durante la temporada navideña.',
    description: 'Descripción del descuento'
  })
  @IsString()
  description: string;

  @ApiProperty({
    example: 15,
    description: 'Porcentaje del descuento'
  })
  @IsNumber()
  percentage: number;

  @ApiProperty({
    example: '2024-12-01T00:00:00.000Z',
    description: 'Fecha de inicio del descuento'
  })
  @IsDate()
  startDate: Date;

  @ApiProperty({
    example: '2024-12-31T23:59:59.999Z',
    description: 'Fecha límite del descuento'
  })
  @IsDate()
  deadline: Date;

  @ApiProperty({
    example: "https://res.cloudinary.com/dxttqmyxu/image/upload/v1731483047/kkizccq7zv9j37jg0hi3.png"
  })
  image?: string
}
