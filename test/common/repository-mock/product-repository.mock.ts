import { CategoryID } from "src/category/domain/value-objects/category-id";
import { Result } from "src/common/domain/result-handler/Result";
import { Product } from "src/product/domain/product";
import { IProductRepository } from "src/product/domain/repositories/product-repository.interface";
import { HistoricoPrecio } from "src/product/infraestructure/entities/historico-precio.entity";

export class ProductRepositoryMock implements IProductRepository {

    private readonly productos: Product[] = []
    private readonly historico_precio: HistoricoPrecio[] = []

    async saveProductAggregate(product: Product): Promise<Result<Product>> {
        this.productos.push(product)
        return Result.success<Product>(product, 200)
    }

    updateProductAggregate(product: Product): Promise<Result<Product>> {
        throw new Error("Method not implemented.");
    }

    async findProductById(id: string): Promise<Result<Product>> {
        const producto = this.productos.find(producto => producto.Id.Id === id)
        if (!producto) {
            return Result.fail<Product>(new Error('Product not found'), 404, 'Product not found')
        }
        return Result.success<Product>(producto, 200)
    }

    async findProductByName(name: string): Promise<Result<Product>> {
        const producto = this.productos.find(producto => producto.Name === name)
        if (!producto) {
            return Result.fail<Product>(new Error('Product not found'), 404, 'Product not found')
        }
        return Result.success<Product>(producto, 200)
    }

    async findAllProducts(page: number, limit: number, category?: string[], name?: string, price?: number, discount?: string): Promise<Result<Product[]>> {

        if (page < 1) {
            page = 1;
        }

        const offset = (page - 1) * limit;
        console.log('Offset calculado:', offset);

        // Filtrar productos según las condiciones
        let filteredProducts = this.productos;

        // Filtrar por categoría
        if (category && category.length > 0) {
            console.log('Filtrando por categorías:', category);
            filteredProducts = filteredProducts.filter(product =>
                category.every(c => product.Categories.includes(CategoryID.create(c)))
            );
        }

        // Filtrar por nombre
        if (name) {
            console.log('Filtrando por nombre del producto:', name);
            filteredProducts = filteredProducts.filter(product =>
                product.Name.toLowerCase().includes(name.toLowerCase())
            );
        }

        // Filtrar por precio
        if (price !== null) {
            console.log('Filtrando por precio:', price);
            filteredProducts = filteredProducts.filter(product => product.Price === price);
        }

        // Filtrar por descuento
        if (discount !== null) {
            console.log('Filtrando por descuento:', discount);
            filteredProducts = filteredProducts.filter(product => product.Discount.Value === discount);
        }

        // Total count de productos después de los filtros
        const totalCount = filteredProducts.length;

        // Verificar si el offset excede el total
        if (offset >= totalCount) {
            return Result.success<Product[]>([], 200);
        }

        // Obtener los productos según el offset y el límite
        const paginatedProducts = filteredProducts.slice(offset, offset + limit);

        return Result.success<Product[]>(paginatedProducts, 200);
    }

    async verifyNameProduct(name: string): Promise<Result<boolean>> {
        const producto = await this.productos.find(
            product => product.Name.toLowerCase() === name.toLowerCase()
        );
        if (!producto)
            return Result.success<boolean>(true, 200);
        return Result.fail<boolean>(new Error('Product registered'), 403, 'Product registered');
    }

    async deleteProduct(id: string): Promise<Result<boolean>> {
        const index = this.productos.findIndex(product => product.Id.Id === id);
        if (index !== -1) {
            this.productos.splice(index, 1); // Eliminar el producto de la lista
            return Result.success<boolean>(true, 200); // Si se encontró y eliminó el producto
        }

        return Result.fail<boolean>(new Error('Product not found'), 404, "Product not found");

    }

}