import { Result } from "src/common/domain/result-handler/Result";
import { Cupon } from "src/cupon/domain/cupon";
import { ICuponRepository } from "src/cupon/domain/repositories/cupon-repository.interface";
import { UserId } from "src/user/domain/value-object/user-id";

export class CuponRepositoryMock implements ICuponRepository {

    private readonly cupones: Cupon[] = []

    async saveCuponAggregate(cupon: Cupon): Promise<Result<Cupon>> {
        this.cupones.push(cupon);
        return Result.success(cupon, 200)
    }
    async verifyCuponCode(code: string): Promise<Result<boolean>> {
        const cupon = this.cupones.find(
            (cupon) => cupon.Code() === code,
        );
        if (cupon === undefined) {
            return Result.success<boolean>(
                false,
                200
            );
        }
        return Result.success<boolean>(true, 200);
    }
    async deleteCupon(id: string): Promise<Result<Cupon>> {
        throw new Error("Method not implemented.");
    }
    async findCuponById(id: string): Promise<Result<Cupon>> {
        const cupon = this.cupones.find(
            (cupon) => cupon.Id.Id() === id,
        );
        if (cupon === undefined) {
            return Result.fail<Cupon>(
                new Error(`Cupon with id ${id} not found`),
                404,
                `Cupon with id ${id} not found`,
            );
        }
        return Result.success<Cupon>(cupon, 200);

    }
    async findCuponByCode(code: string): Promise<Result<Cupon>> {
        const cupon = this.cupones.find(
            (cupon) => cupon.Code() === code,
        );
        if (cupon === undefined) {
            return Result.fail<Cupon>(
                new Error(`Cupon with code ${code} not found`),
                404,
                `Cupon with code ${code} not found`,
            );
        }
        return Result.success<Cupon>(cupon, 200);
    }
    async findAllCoupons(page: number, limit: number): Promise<Result<Cupon[]>> {
        throw new Error("Method not implemented.");
    }
    async findAllCuponsByUser(id_user: UserId): Promise<Result<Cupon[]>> {
        throw new Error("Method not implemented.");
    }


}