import { DataSource, Repository } from "typeorm";

import { IMapper } from "src/common/application/mappers/mapper.interface";
import { Result } from "src/common/domain/result-handler/Result";
import { Cupon } from "src/cupon/domain/cupon";
import { ICuponRepository } from "src/cupon/domain/repositories/cupon-repository.interface";
import { OrmCupon } from "../entites/cupon.entity";
import { CuponNotFoundException } from "../exceptions/cupon-not-found-exception";
import { CuponRegisteredException } from "../exceptions/cupon-code-registered-exception";

export class CuponRepository extends Repository<OrmCupon> implements ICuponRepository {

    private readonly cuponMapper: IMapper<Cupon, OrmCupon>

    constructor(
        cuponMapper: IMapper<Cupon, OrmCupon>, dataSource: DataSource
    ) {
        super(OrmCupon, dataSource.createEntityManager())
        this.cuponMapper = cuponMapper
    }
    async findAllCoupons(page: number, limit: number): Promise<Result<Cupon[]>> {
        const coupons = await this.find({
            skip: page,
            take: limit,
        })

        if(!coupons)
            return Promise.resolve(Result.fail<Cupon[]>(new Error(`Cupones no almacenados`), 404, `Cupones no almacenados`))
        
        const resultado = await Promise.all(
            coupons.map(async (coupon) => {
              return await this.cuponMapper.fromPersistenceToDomain(coupon); // Retorna el Product
            }));
        return Result.success<Cupon[]>(resultado,202)
    }

    async saveCuponAggregate(cupon: Cupon): Promise<Result<Cupon>> {
        try {
            const ormCupon = await this.cuponMapper.fromDomainToPersistence(cupon)
            const resultado = await this.save(ormCupon)
            return Result.success<Cupon>(cupon, 200)
        } catch (error) {
            return Result.fail<Cupon>(new Error(error.message), error.code, error.message)

        }
    }

    async verifyCuponCode(code: string): Promise<Result<boolean>> {
        const cupon = await this.findOneBy({code})
        if (!cupon)
            return Result.success<boolean>(true, 200);
        return Result.fail<boolean>(new CuponRegisteredException(code), 403, `Cupon with code ${code} does not exists`);
    }

    async deleteCupon(id: string): Promise<Result<Cupon>> {
        const cupon = await this.findOneBy({ id });
        if (cupon) {
            await this.delete(cupon);
            return Result.success<Cupon>(await this.cuponMapper.fromPersistenceToDomain(cupon), 200);
        }
        return Result.fail<Cupon>(new CuponNotFoundException(id), 403, `Cupon ${id} not found`)
    }

    async findCuponById(id: string): Promise<Result<Cupon>> {
        const cupon = await this.findOne({
            where: { id: id }
        });

        if (!cupon)
            return Result.fail<Cupon>(new CuponNotFoundException(id), 403, `Cupon ${id} not found`)

        const resultado = await this.cuponMapper.fromPersistenceToDomain(cupon)

        return Result.success(resultado, 200)
    }

}