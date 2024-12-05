import { DataSource, Repository } from 'typeorm';
import { OrmDiscount } from '../entities/orm-discount.entity';
import { Discount } from 'src/discount/domain/discount.entity';
import { IMapper } from 'src/common/application/mappers/mapper.interface';
import { Result } from 'src/common/domain/result-handler/Result';
import { DiscountNotFoundException } from '../exceptions/discount-not-found.exception';
import { IDiscountRepository } from 'src/discount/domain/repositories/discount.repository.interface';

export class OrmDiscountRepository
  extends Repository<OrmDiscount>
  implements IDiscountRepository {
  private readonly ormDiscountMapper: IMapper<Discount, OrmDiscount>;

  constructor(ormDiscountMapper: IMapper<Discount, OrmDiscount>, dataSource: DataSource) {
    super(OrmDiscount, dataSource.createEntityManager());
    this.ormDiscountMapper = ormDiscountMapper;
  }
  async findAllDiscounts(page: number, limit: number): Promise<Result<Discount[]>> {
    const discounts = await this.find({
      skip: page,
      take: limit
    })

    if (!discounts)
      return Result.fail<Discount[]>(new Error(`Descuentos no almacenados`), 404, `Descuentos no almacenados`)

    const resultado = await Promise.all(
      discounts.map(async (discount) => {
        return await this.ormDiscountMapper.fromPersistenceToDomain(discount); // Retorna el Product
      })
    );

    return Result.success<Discount[]>(resultado, 202)
  }


  async addDiscount(discount: Discount): Promise<Result<Discount>> {
    try {
      const ormDiscount = await this.ormDiscountMapper.fromDomainToPersistence(discount);

      const result = await this.save(ormDiscount);

      return Result.success<Discount>(
        await this.ormDiscountMapper.fromPersistenceToDomain(result),
        201
      );
    } catch (error) {
      return Result.fail<Discount>(error, 500, error.message);
    }
  }


  async findDiscountById(id: string): Promise<Result<Discount>> {
    try {
      const ormDiscount = await this.findOneBy({ id });

      if (!ormDiscount) {
        return Result.fail<Discount>(
          new DiscountNotFoundException(`Discount with id ${id} not found`),
          404,
          `Discount with id ${id} not found`
        );
      }

      const discount = await this.ormDiscountMapper.fromPersistenceToDomain(ormDiscount);
      return Result.success<Discount>(discount, 200);
    } catch (error) {
      return Result.fail<Discount>(error, 500, error.message);
    }
  }
}
