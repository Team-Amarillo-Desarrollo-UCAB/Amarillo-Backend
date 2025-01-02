import { DataSource, Repository } from "typeorm";

import { IMapper } from "src/common/application/mappers/mapper.interface";
import { Result } from "src/common/domain/result-handler/Result";
import { Cupon } from "src/cupon/domain/cupon";
import { ICuponRepository } from "src/cupon/domain/repositories/cupon-repository.interface";
import { OrmCupon } from "../entites/cupon.entity";
import { CuponNotFoundException } from "../exceptions/cupon-not-found-exception";
import { CuponRegisteredException } from "../exceptions/cupon-code-registered-exception";
import { UserId } from "src/user/domain/value-object/user-id";

export class CuponRepository extends Repository<OrmCupon> implements ICuponRepository {

    private readonly cuponMapper: IMapper<Cupon, OrmCupon>

    constructor(
        cuponMapper: IMapper<Cupon, OrmCupon>, dataSource: DataSource
    ) {
        super(OrmCupon, dataSource.createEntityManager())
        this.cuponMapper = cuponMapper
    }

    async findCuponByCode(code: string): Promise<Result<Cupon>> {
        const cupon = await this.findOne({
            where: { code: code }
        });

        if (!cupon)
            return Result.fail<Cupon>(new CuponNotFoundException(code), 403, `Cupon ${code} not found`)

        const resultado = await this.cuponMapper.fromPersistenceToDomain(cupon)

        return Result.success(resultado, 202)
    }


    async findAllCoupons(page: number, limit: number): Promise<Result<Cupon[]>> {
        const coupons = await this.find({
            skip: page,
            take: limit,
        })

        if (!coupons)
            return Promise.resolve(Result.fail<Cupon[]>(new Error(`Cupones no almacenados`), 404, `Cupones no almacenados`))

        const resultado = await Promise.all(
            coupons.map(async (coupon) => {
                return await this.cuponMapper.fromPersistenceToDomain(coupon); // Retorna el Product
            }));
        return Result.success<Cupon[]>(resultado, 202)
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
        const cupon = await this.findOneBy({ code })
        if (!cupon)
            return Result.success<boolean>(true, 200);
        return Result.fail<boolean>(new CuponRegisteredException(code), 403, `Cupon with code ${code} does not exists`);
    }

    async deleteCupon(id: string): Promise<Result<Cupon>> {
        const cupon = await this.findOneBy({ id });
        if (cupon) {
            await this.createQueryBuilder('cupon')
                .delete()
                .where('id = :id', { id })
                .execute();
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

    async findAllCuponsByUser(id_user: UserId): Promise<Result<Cupon[]>> {

        try {
            const find_cupones = await this.createQueryBuilder('cupon')
                .innerJoin('cupon.users', 'user') // Unir la relación de usuarios
                .where('user.id = :id_user', { id_user }) // Filtrar por el ID del usuario
                .getMany(); // Obtener los registros


            if (!find_cupones)
                return Result.fail<Cupon[]>(new Error(`Cupones no almacenadas`), 404, `Cupones no almacenadas`)

            const result: Cupon[] = []

            for (const cupon of find_cupones) {

                result.push(
                    await this.cuponMapper.fromPersistenceToDomain(cupon)
                )

            }

            return Result.success<Cupon[]>(result, 202)
        } catch (error) {
            return Result.fail<Cupon[]>(new Error(`Error al buscar los cupones`), 500, `Error al buscar los cupones`)
        }
    }

}