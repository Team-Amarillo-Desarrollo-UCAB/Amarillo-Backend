import { EnumOrderEstados } from "src/order/domain/enum/order-estados-enum"

export interface CreateOrderResponseServiceDTO {

    id: string

    orderState: string

    orderCreatedDate: Date

    totalAmount: number

    currency: string

    orderDirection: {
        lat: number,
        long: number
    }

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