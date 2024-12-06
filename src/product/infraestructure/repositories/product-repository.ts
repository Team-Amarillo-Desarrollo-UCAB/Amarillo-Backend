/* eslint-disable @typescript-eslint/no-unused-vars */
import { DataSource, Repository } from "typeorm";

import { IMapper } from "src/common/application/mappers/mapper.interface";
import { Result } from "src/common/domain/result-handler/Result";
import { Product } from "src/product/domain/product";
import { IProductRepository } from "src/product/domain/repositories/product-repository.interface";
import { OrmProduct } from "../entities/product.entity";

export class OrmProductRepository extends Repository<OrmProduct> implements IProductRepository {

    private readonly ormProductMapper: IMapper<Product, OrmProduct>

    constructor(ormProductMapper: IMapper<Product, OrmProduct>, dataSource: DataSource,) {
        super(OrmProduct, dataSource.createEntityManager());
        this.ormProductMapper = ormProductMapper
    }

    async saveProductAggregate(product: Product): Promise<Result<Product>> {

        try {
            const producto = await this.ormProductMapper.fromDomainToPersistence(product)
            console.log("producto: ", producto)
            const resultado = await this.save(producto)
            return Result.success<Product>(product, 200)
        } catch (error) {
            console.log(error)
            return Result.fail<Product>(new Error(error.message), error.code, error.message)
        }

    }

    async findProductById(id: string): Promise<Result<Product>> {
        const product = await this.findOne({
            where: { id: id },
            relations: ['historicos'],
        });

        if (!product)
            return Result.fail<Product>(new Error(`Producto con id ${id} no encontrado`), 404, `Producto con id ${id} no encontrado`)

        const resultado = await this.ormProductMapper.fromPersistenceToDomain(product)

        return Result.success(resultado, 202)
    }

    async findProductByName(name: string): Promise<Result<Product>> {

        const product = await this.findOne({
            where: { name: name },
            relations: ['historicos'],
        });

        if (!product)
            return Result.fail<Product>(new Error(`Producto ${name} no encontrado`), 404, `Producto ${name} no encontrado`)

        const resultado = await this.ormProductMapper.fromPersistenceToDomain(product)

        return Result.success(resultado, 202)
    }

    async findAllProducts(page: number, limit: number): Promise<Result<Product[]>> {
        const products = await this.find({
            skip: page,
            take: limit,
            relations: ['historicos'],
        })

        if (!products)
            return Result.fail<Product[]>(new Error(`Productos no almacenados`), 404, `Productos no almacenados`)

        const resultado = await Promise.all(
            products.map(async (product) => {
                return await this.ormProductMapper.fromPersistenceToDomain(product); // Retorna el Product
            })
        );

        return Result.success<Product[]>(resultado, 202)
    }

    async verifyNameProduct(name: string): Promise<Result<boolean>> {

        const producto = await this.findOneBy({ name })
        if (!producto)
            return Result.success<boolean>(true, 200);
        return Result.fail<boolean>(new Error('Product registered'), 403, 'Product registered');

    }

    async deleteProduct(id: string): Promise<Result<boolean>> {
        const result = await this.delete({ id: id });

        if (result.affected === 0) {
            return Result.fail(new Error('Product not found'), 404, "Product not found")
        }

        return Result.success<boolean>(true, 200)

    }

}