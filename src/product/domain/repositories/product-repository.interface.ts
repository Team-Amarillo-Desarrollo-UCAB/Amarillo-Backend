import { Result } from "src/common/domain/result-handler/Result";
import { Product } from "../product";

export interface IProductRepository {
    saveProductAggregate(product: Product): Promise<Result<Product>>;
    updateProductAggregate(product: Product): Promise<Result<Product>>
    findProductById(id: string): Promise<Result<Product>>;
    findProductByName(name: string): Promise<Result<Product>>
    findAllProducts(page: number, limit: number, category?:string[], name?:string, price?:number, discount?:string): Promise<Result<Product[]>>
    verifyNameProduct(name: string): Promise<Result<boolean>>
    deleteProduct(id: string): Promise<Result<boolean>>
}