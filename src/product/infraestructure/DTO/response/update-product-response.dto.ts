import { ApiProperty } from "@nestjs/swagger";

export class UpdateProductResponseDTO{

    @ApiProperty({
        example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
    })
    id_producto: string
}