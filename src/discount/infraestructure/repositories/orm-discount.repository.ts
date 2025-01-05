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
  async updateDiscount(discount: Discount): Promise<Result<Discount>> {
       try{
        const s = await this.addDiscount(discount)
        return Result.success<Discount>(s.Value,200)
       }catch(error){
        return Result.fail<Discount>(new Error(error.message), error.code, error.message)
       }  
  }

  async deleteDiscount(id: string): Promise<Result<Discount>> {
    try {
        const discount = await this.findOneBy({ id });

        if (!discount) {
            return Result.fail<Discount>(
                new DiscountNotFoundException("Discount not found!"),
                404,
                'Discount not found'
            );
        }

        await this.remove(discount);

        const domainDiscount = await this.ormDiscountMapper.fromPersistenceToDomain(discount);

        return Result.success<Discount>(domainDiscount, 200);
    } catch (error) {
        return Result.fail<Discount>(error, 500, error.message);
    }
}


    async findAllDiscounts(page: number, limit: number): Promise<Result<Discount[]>> {
      if (page < 1) {
          page = 1;
      }
      if (limit < 1) {
          limit = 10;
      }

      const offset = (page - 1) * limit;
      console.log('Offset calculado:', offset);

      try {
          const totalCount = await this.createQueryBuilder('discount').getCount();

          if (offset >= totalCount) {
              return Result.success<Discount[]>([], 200);
          }

          const queryBuilder = this.createQueryBuilder('discount');
          queryBuilder.andWhere('discount.deadline >= CURRENT_DATE');
          queryBuilder.skip(offset).take(limit);

          const discounts = await queryBuilder.getMany();

          if (!discounts || discounts.length === 0) {
              return Result.success<Discount[]>([], 200);
          }

          const domainDiscounts = await Promise.all(
              discounts.map((discount) =>
                  this.ormDiscountMapper.fromPersistenceToDomain(discount)
              )
          );

          return Result.success<Discount[]>(domainDiscounts, 200);
      } catch (error) {
          console.error('Error en findAllDiscounts:', error);
          return Result.fail<Discount[]>(
              new Error('Error al buscar descuentos'),
              500,
              'Error interno del servidor'
          );
      }
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
