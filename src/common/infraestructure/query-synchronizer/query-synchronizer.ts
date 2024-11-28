import { Result } from "src/common/domain/result-handler/Result"



export interface Querysynchronizer<T> {
    execute(event: T): Promise<Result<string>>
}