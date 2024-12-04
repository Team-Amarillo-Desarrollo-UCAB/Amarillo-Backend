import { Result } from "src/common/domain/result-handler/Result";
import { IProductRepository } from "src/product/domain/repositories/product-repository.interface";
import { ProductId } from "src/product/domain/value-objects/product-id";

export class ProductsExistenceService {
    constructor(private readonly productRepository: IProductRepository) {
        this.productRepository = productRepository;
    }

    async productsExistenceCheck(productIDs: string[]):Promise<Result<ProductId[]>> {
        const products: ProductId[] = [];
        for (const p of productIDs) {
            const productID = ProductId.create(p);  // Creación del ID de producto
            const productResult = await this.productRepository.findProductById(productID.Id);  // Buscar el producto por ID

            if (!productResult.isSuccess()) {
                return Result.fail(new Error('ERROR: El producto no existe en la BD'), 404, 'Producto no existe en BD');
            } else {
                products.push(productID);
            }
        }

        return Result.success(products, 200);  // Retornar éxito con todos los productos existentes
    }
}
