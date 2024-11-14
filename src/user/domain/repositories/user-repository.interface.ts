import { Result } from "src/common/domain/result-handler/Result";
import { User } from "../user";

export interface IUserRepository {
    saveUserAggregate(user: User): Promise<Result<User>>;
    findUserByEmail(email: string): Promise<Result<User>>;
    verifyUserExistenceByEmail(email: string): Promise<Result<boolean>>;
    verifyUserExistenceByPhone(phone: string): Promise<Result<boolean>>;
    findUserById(id: string): Promise<Result<User>>;
}