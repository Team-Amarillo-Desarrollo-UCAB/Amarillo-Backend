import { Result } from "src/common/domain/result-handler/Result";
import { Product } from "../product";

export interface IProductRepository {
    saveProductAggregate(product: Product): Promise<Result<Product>>;
    findProductById(id: string): Promise<Result<Product>>;
    findProductByName(name: string): Promise<Result<Product>>
    findAllProducts(page: number, limit: number): Promise<Result<Product[]>>
    verifyNameProduct(name: string): Promise<Result<boolean>>
    deleteProduct(id: string): Promise<Result<boolean>>
}