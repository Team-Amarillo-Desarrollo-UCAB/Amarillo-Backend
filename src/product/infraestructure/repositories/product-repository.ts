/* eslint-disable @typescript-eslint/no-unused-vars */
import { DataSource, Repository, getRepository } from 'typeorm';

import { IMapper } from "src/common/application/mappers/mapper.interface";
import { Result } from "src/common/domain/result-handler/Result";
import { Product } from "src/product/domain/product";
import { IProductRepository } from "src/product/domain/repositories/product-repository.interface";
import { OrmProduct } from "../entities/product.entity";
import { HistoricoPrecio } from "../entities/historico-precio.entity";

export class OrmProductRepository extends Repository<OrmProduct> implements IProductRepository {

    private readonly ormProductMapper: IMapper<Product, OrmProduct>

    private readonly historicoPrecioRepository: Repository<HistoricoPrecio>

    constructor(ormProductMapper: IMapper<Product, OrmProduct>, dataSource: DataSource,) {
        super(OrmProduct, dataSource.createEntityManager());
        this.ormProductMapper = ormProductMapper

        this.historicoPrecioRepository = dataSource.getRepository(HistoricoPrecio)
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

    async updateProductAggregate(product: Product): Promise<Result<Product>> {
        try {
            const producto = await this.ormProductMapper.fromDomainToPersistence(product)
            // const historico = await this.historicoPrecioRepository.find({
            //     where: {
            //         producto: { id: producto.id },
            //     }
            // });
            // producto.historicos = historico
            console.log("producto para actualizar: ", producto)
            await this.save(producto)
            console.log("producto actualizado")
            return Result.success<Product>(product, 200)
        } catch (error) {
            console.log(error)
            return Result.fail<Product>(new Error(error.message), error.code, error.message)
        }

    }

    async findProductById(id: string): Promise<Result<Product>> {
        const product = await this.findOneBy({ id });

        if (!product)
            return Result.fail<Product>(new Error(`Producto con id ${id} no encontrado`), 404, `Producto con id ${id} no encontrado`)

        const resultado = await this.ormProductMapper.fromPersistenceToDomain(product)

        return Result.success(resultado, 202)
    }

    async findProductByName(name: string): Promise<Result<Product>> {

        const product = await this.findOne({
            where: { name: name },
        });

        if (!product)
            return Result.fail<Product>(new Error(`Producto ${name} no encontrado`), 404, `Producto ${name} no encontrado`)

        const resultado = await this.ormProductMapper.fromPersistenceToDomain(product)

        return Result.success(resultado, 202)
    }

    async findAllProducts(
        page,
        perpage: number = 10,
        category?: string[],
        name?: string,
        price?: number,
        popular?:string,
        discount?: string
    ): Promise<Result<Product[]>> {
        if (page < 1) {
            page = 1;
        }

        console.log("PAGE:",page)
        console.log("PERPAGE:",perpage)

        const offset = (page - 1) * perpage;
        console.log('Offset calculado:', offset);

        try {
            const totalCount = await this.createQueryBuilder('producto').getCount();

            if (offset >= totalCount) {
                return Result.success<Product[]>([], 200);
            }

            const queryBuilder = this.createQueryBuilder('producto');

            if (category && category.length > 0) {
                console.log('Filtrando por categorías:', category);
                queryBuilder.andWhere(
                    `producto.categories::jsonb @> :categories`,
                    { categories: category },
                );
            }

            if (name) {
                console.log('Filtrando por nombre del producto:', name);
                queryBuilder.andWhere('LOWER(producto.name) LIKE LOWER(:name)', { name: `%${name}%` });
            }

            if (price) {
                console.log('Filtrando por precio:', price);
                queryBuilder.andWhere('producto.price = :price', { price });
            }

            if (popular && popular.trim() !== '') {
                console.log('Filtrando por popularidad:', popular);
                queryBuilder
                    .leftJoin('Detalle_carrito', 'dc', 'dc.id_producto = producto.id')
                    .where('dc.id_producto IS NOT NULL')
                    .groupBy('producto.id')
                    .addSelect('COUNT(dc.id)', 'popularity')
                    .orderBy('popularity', 'DESC')
                }

            if (discount) {
                console.log('Filtrando por descuento:', discount);
                queryBuilder.andWhere('producto.discount = :discount', { discount });
            }

            queryBuilder.skip(offset).take(perpage);

            const products = await queryBuilder.getMany();

            if (!products || products.length === 0) {
                return Result.success<Product[]>([], 200);
            }

            const domainProducts = await Promise.all(
                products.map((product) => this.ormProductMapper.fromPersistenceToDomain(product))
            );

            return Result.success<Product[]>(domainProducts, 200);
        } catch (error) {
            console.error('Error en findAllProducts:', error);
            return Result.fail<Product[]>(
                new Error('Error al buscar productos'),
                500,
                'Error interno del servidor'
            );
        }
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