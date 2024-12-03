import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNumber, IsDate, IsPositive } from "class-validator";

export class CreateDiscountEntryDTO {
  
  @ApiProperty({
    example: "Descuento del Black Friday"
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: "Descuento especial para el Black Friday en todos los productos seleccionados"
  })
  @IsString()
  description: string;

  @ApiProperty({
    example: 20
  })
  @IsNumber()
  @IsPositive()
  percentage: number;

  @ApiProperty({
    example: "2024-11-01T00:00:00.000Z"
  })
  @IsDate()
  startDate: Date;

  @ApiProperty({
    example: "2024-11-30T23:59:59.999Z"
  })
  @IsDate()
  deadline: Date;
}
