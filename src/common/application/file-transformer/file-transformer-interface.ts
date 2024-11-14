import { Result } from "src/common/domain/result-handler/Result"

export interface FileTransformer<F,T> {

    transformFile( file: F): Promise<Result<T>>

}