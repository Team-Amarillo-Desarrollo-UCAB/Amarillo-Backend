import { EnumOrderEstados } from "src/order/domain/enum/order-estados-enum";

export class GetOrderByIdResponseServiceDTO {

    id: string

    orderState: EnumOrderEstados

    orderCreatedDate: Date

    totalAmount: number

    sub_total?: number

    currency: string

    orderDirection: {
        lat: number,
        long: number
    }

    directionName?: string

    products: {
        id: string,
        quantity: number
    }[]

    bundles: {
        id: string,
        quantity: number
    }[]

    orderReciviedDate?: Date

    orderReport?: string

    orderPayment?: {
        amount: number,
        currency: string,
        paymentMethod: string
    }

    orderDiscount?: number

}