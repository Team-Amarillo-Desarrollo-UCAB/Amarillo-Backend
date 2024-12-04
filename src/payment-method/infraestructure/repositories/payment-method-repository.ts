import { Result } from 'src/common/domain/result-handler/Result';
import { EnumPaymentMethod } from 'src/payment-method/domain/enum/PaymentMethod';
import { PaymentMethod } from 'src/payment-method/domain/payment-method';
import { IPaymentMethodRepository } from '../../domain/repositories/payment-method-repository.interface';
import { DataSource, Repository } from 'typeorm';
import { OrmPaymentMethod } from '../entities/payment-method.entity';
import { IMapper } from 'src/common/application/mappers/mapper.interface';

export class PaymentMethodRepository extends Repository<OrmPaymentMethod> implements IPaymentMethodRepository {

    private readonly paymentMethodMapper: IMapper<PaymentMethod, OrmPaymentMethod>

    constructor(
        datasource: DataSource,
        paymenMethod: IMapper<PaymentMethod, OrmPaymentMethod>
    ) {
        super(OrmPaymentMethod, datasource.createEntityManager())
        this.paymentMethodMapper = paymenMethod
    }

    async savePaymentMethodAggregate(metodo: PaymentMethod): Promise<Result<PaymentMethod>> {
        try {
            const ormPaymentMethod = await this.paymentMethodMapper.fromDomainToPersistence(metodo)
            const resultado = await this.save(ormPaymentMethod)
            return Result.success<PaymentMethod>(metodo, 200)
        } catch (error) {
            return Result.fail<PaymentMethod>(new Error(error.message), error.code, error.message)

        }
    }

    findAllPaymentMethod(): Promise<Result<PaymentMethod[]>> {
        throw new Error('Method not implemented.');
    }
    async deletePaymentMethod(id: string): Promise<Result<boolean>> {
        const result = await this.delete({id: id});

        if (result.affected === 0) {
            return Result.fail(new Error('Payment method not found'),404,"Payment method not found")
        }

        return Result.success<boolean>(true,200)
    }
    verifyPaymentMethodByName(name: EnumPaymentMethod): Promise<Result<boolean>> {
        throw new Error('Method not implemented.');
    }

}