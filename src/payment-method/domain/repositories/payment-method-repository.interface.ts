import { Result } from "src/common/domain/result-handler/Result";
import { PaymentMethod } from "../payment-method";
import { EnumPaymentMethod } from "../enum/PaymentMethod";

export interface IPaymentMethodRepository{

    savePaymentMethodAggregate(metodo: PaymentMethod): Promise<Result<PaymentMethod>>
    findAllPaymentMethod(): Promise<Result<PaymentMethod[]>>
    deletePaymentMethod(id: string): Promise<Result<boolean>>
    verifyPaymentMethodByName(name: EnumPaymentMethod): Promise<Result<boolean>>

}