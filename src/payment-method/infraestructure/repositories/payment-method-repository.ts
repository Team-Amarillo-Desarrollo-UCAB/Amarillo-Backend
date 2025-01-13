import { Result } from 'src/common/domain/result-handler/Result';
import { EnumPaymentMethod } from 'src/payment-method/domain/enum/PaymentMethod';
import { PaymentMethod } from 'src/payment-method/domain/payment-method';
import { IPaymentMethodRepository } from '../../domain/repositories/payment-method-repository.interface';
import { DataSource, Repository } from 'typeorm';
import { OrmPaymentMethod } from '../entities/payment-method.entity';
import { IMapper } from 'src/common/application/mappers/mapper.interface';
import { EncryptorBcrypt } from '../../../common/infraestructure/encryptor/encryptor-bcrypt';

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

    async findPaymentMethodByName(name: EnumPaymentMethod): Promise<Result<PaymentMethod>> {
        try {

            const metodo = await this.findOne({
                where: { name: name }
            })

            if (!metodo)
                return Result.fail<PaymentMethod>(new Error('Metodo no existente'), 404, 'Metodo no existente')

            return Result.success<PaymentMethod>(await this.paymentMethodMapper.fromPersistenceToDomain(metodo), 200)

        } catch (error) {
            return Result.fail<PaymentMethod>(new Error(error.message), error.code, error.message)
        }
    }

    async findPaymentMethodById(id: string): Promise<Result<PaymentMethod>> {
        try {

            const metodo = await this.findOne({
                where: { id: id }
            })

            if (!metodo)
                return Result.fail<PaymentMethod>(new Error('Metodo no existente'), 404, 'Metodo no existente')

            return Result.success<PaymentMethod>(await this.paymentMethodMapper.fromPersistenceToDomain(metodo), 200)

        } catch (error) {
            return Result.fail<PaymentMethod>(new Error(error.message), error.code, error.message)
        }
    }


    async findAllPaymentMethod(page: number, limit: number): Promise<Result<PaymentMethod[]>> {
        const metodos = await this.find({
            skip: page,
            take: limit,
        })

        if (!metodos)
            return Result.fail<PaymentMethod[]>(new Error(`Metodos no almacenados`), 404, `Metodos no almacenados`)

        const resultado = await Promise.all(
            metodos.map(async (metodo) => {
                return await this.paymentMethodMapper.fromPersistenceToDomain(metodo); // Retorna el Product
            })
        );

        return Result.success<PaymentMethod[]>(resultado, 202)
    }
    async deletePaymentMethod(id: string): Promise<Result<boolean>> {
        const result = await this.delete({ id: id });

        if (result.affected === 0) {
            return Result.fail(new Error('Payment method not found'), 404, "Payment method not found")
        }

        return Result.success<boolean>(true, 200)
    }

    async verifyPaymentMethodByName(name: EnumPaymentMethod): Promise<Result<boolean>> {

        try {

            const metodo = await this.findOneBy({
                name: name
            })

            if (metodo)
                return Result.fail<boolean>(new Error('Payment method registered'), 403, 'Payment method');

            return Result.success<boolean>(false, 200)

        } catch (error) {
            return Result.fail<boolean>(new Error(error.message), error.code, error.message)
        }

    }

}