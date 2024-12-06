import { EnumPaymentMethod } from "src/payment-method/domain/enum/PaymentMethod"

export interface GetAllPaymentMethodResponseDTO {

    id_payment: string

    name: EnumPaymentMethod

    active: boolean

}