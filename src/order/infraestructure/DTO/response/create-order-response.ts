import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class CreateOrderResponseDTO{

    @ApiProperty({
        example: '550e8400-e29b-41d4-a716-446655440000'
    })
    @IsString()
    @IsNotEmpty()
    id: string

    orderState: string

    orderCreatedDate: Date

    totalAmount: number

    currency: string

    products: {
        id: string
        quantity: number
        nombre: string
        descripcion: string
        price: number
        currency: string
        images: string[]
    }[]

    bundles: {
        id: string,
        quantity: number
        nombre: string
        descripcion: string
        price: number
        currency: string
        images: string[]
    }[]

    orderReciviedDate?: Date

    orderReport?: string

    orderPayment?: {
        amount: number,
        currency: string,
        paymentMethod: string
    }

}