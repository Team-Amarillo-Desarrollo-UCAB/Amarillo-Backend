import { Result } from "src/common/domain/result-handler/Result";
import { EnumPaymentMethod } from "src/payment-method/domain/enum/PaymentMethod";
import { PaymentMethod } from "src/payment-method/domain/payment-method";
import { IPaymentMethodRepository } from "src/payment-method/domain/repositories/payment-method-repository.interface";

export class PaymentMethodRepositoryMock implements IPaymentMethodRepository {

    private readonly methods: PaymentMethod[] = []

    async savePaymentMethodAggregate(metodo: PaymentMethod): Promise<Result<PaymentMethod>> {
        this.methods.push(metodo);
        return Result.success(metodo, 200)
    }

    async findPaymentMethodById(id: string): Promise<Result<PaymentMethod>> {
        const metodo = this.methods.find(
            (metodo) => metodo.Id.Id === id,
        );
        if (metodo === undefined) {
            return Result.fail<PaymentMethod>(
                new Error(`Payment Method with id ${id} not found`),
                404,
                `Payment Method with id ${id} not found`,
            );
        }
        return Result.success<PaymentMethod>(metodo, 200);
    }

    async findPaymentMethodByName(name: EnumPaymentMethod): Promise<Result<PaymentMethod>> {
        throw new Error("Method not implemented.");
    }

    async findAllPaymentMethod(page: number, limit: number): Promise<Result<PaymentMethod[]>> {
        throw new Error("Method not implemented.");
    }

    async deletePaymentMethod(id: string): Promise<Result<boolean>> {
        throw new Error("Method not implemented.");
    }

    async verifyPaymentMethodByName(name: EnumPaymentMethod): Promise<Result<boolean>> {
        throw new Error("Method not implemented.");
    }


}