import { Result } from "src/common/domain/result-handler/Result";
import { Cupon } from "../cupon";
import { UserId } from "src/user/domain/value-object/user-id";

export interface ICuponRepository {
    saveCuponAggregate(cupon: Cupon): Promise<Result<Cupon>>;
    verifyCuponCode(code: string): Promise<Result<boolean>>
    deleteCupon(id: string): Promise<Result<Cupon>>
    findCuponById(id: string): Promise<Result<Cupon>>;
    findCuponByCode(code: string): Promise<Result<Cupon>>;
    findAllCoupons(page: number, limit: number): Promise<Result<Cupon[]>>;
    findAllCuponsByUser(id_user: UserId): Promise<Result<Cupon[]>>
}