import { ApiProperty } from "@nestjs/swagger"

export class GetCouponByCodeResponseDTO{

    @ApiProperty({
        example: 'qwerty'
    })
    code: string

    @ApiProperty({
        example: '2024-12-31'
    })
    expiration_date: Date

    @ApiProperty({
        example: 20
    })
    amount: number


}