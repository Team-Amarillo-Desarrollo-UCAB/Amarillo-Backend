import { DataSource, Repository } from "typeorm";
import { OrmBundle } from "../entities/bundle-orm.entity";
import { IBundleRepository } from "src/bundle/domain/repositories/bundle-repository.interface";
import { Bundle } from "src/bundle/domain/bundle.entity";
import { Result } from "src/common/domain/result-handler/Result";
import { IMapper } from "src/common/application/mappers/mapper.interface";
import { BundleNotFoundException } from "../exceptions/bundle-not-found-exception";

export class OrmBundleRepository extends Repository<OrmBundle> implements IBundleRepository {
    private readonly ormBundleMapper: IMapper<Bundle, OrmBundle>;

    constructor(ormBundleMapper: IMapper<Bundle, OrmBundle>, dataSource: DataSource) {
        super(OrmBundle, dataSource.createEntityManager());
        this.ormBundleMapper = ormBundleMapper;
    }

    async updateBundle(b: Bundle): Promise<Result<Bundle>> {
        try {
            const s = await this.addBundle(b);
            return Result.success<Bundle>(s.Value, 200);
        } catch (error) {
            return Result.fail<Bundle>(new Error(error.message), error.code, error.message);
        }
    }

    async findAllBundles(
        page: number = 1,
        limit: number = 10,
        category?: string[],
        name?: string,
        price?: number,
        popular?: string,
        discount?: string
    ): Promise<Result<Bundle[]>> {
        if (page < 1) {
            page = 1;
        }

        const offset = (page - 1) * limit;
        console.log('Offset calculado:', offset);

        try {
            const totalCount = await this.createQueryBuilder('bundle').getCount();

            if (offset >= totalCount) {
                return Result.success<Bundle[]>([], 200);
            }

            const queryBuilder = this.createQueryBuilder('bundle');

            if (category && category.length > 0) {
                const categoriesArray = Array.isArray(category) ? category : [category];
            
                const conditions = categoriesArray.map((_, index) => 
                    `bundle.categories::jsonb @> :category${index}`
                );
            
                const parameters = categoriesArray.reduce((acc, curr, index) => {
                    acc[`category${index}`] = `["${curr}"]`; 
                    return acc;
                }, {});
            
                queryBuilder.andWhere(conditions.join(' OR '), parameters);
            }
            

            if (name) {
                console.log('Filtrando por nombre del bundle:', name);
                queryBuilder.andWhere('LOWER(bundle.name) LIKE LOWER(:name)', { name: `%${name}%` });
            }

            if (price) {
                console.log('Filtrando por precio:', price);
                queryBuilder.andWhere('bundle.price = :price', { price });
            }

            if (popular && popular.trim() !== '') {
                console.log('Filtrando por popularidad:', popular);
                queryBuilder
                    .leftJoin('Detalle_carrito', 'dc', 'dc.id_bundle = bundle.id')
                    .where('dc.id_bundle IS NOT NULL')
                    .groupBy('bundle.id')
                    .addSelect('COUNT(dc.id)', 'popularity')
                    .orderBy('popularity', 'DESC')
                }

            if (discount) {
                console.log('Filtrando por descuento:', discount);
                queryBuilder.andWhere('bundle.discount = :discount', { discount });
            }

            queryBuilder.andWhere('bundle.stock > 0')
            queryBuilder.andWhere('bundle."caducityDate" >= CURRENT_DATE');
            queryBuilder.skip(offset).take(limit);

            const bundles = await queryBuilder.getMany();

            if (!bundles || bundles.length === 0) {
                return Result.success<Bundle[]>([], 200);
            }

            const domainBundles = await Promise.all(
                bundles.map((bundle) => this.ormBundleMapper.fromPersistenceToDomain(bundle))
            );

            return Result.success<Bundle[]>(domainBundles, 200);
        } catch (error) {
            console.error('Error en findAllBundles:', error);
            return Result.fail<Bundle[]>(new Error('Error al buscar bundles'), 500, 'Error interno del servidor');
        }
    }

    async addBundle(bundle: Bundle): Promise<Result<Bundle>> {
        try {
            const ormBundle = await this.ormBundleMapper.fromDomainToPersistence(bundle);
            const result = await this.save(ormBundle);

            return Result.success<Bundle>(
                await this.ormBundleMapper.fromPersistenceToDomain(result),
                201
            );
        } catch (error) {
            console.log("Ocurrió un error al agregar el bundle");
            console.error('Error al guardar el bundle:', error.message);
            console.error('Detalles del error:', error);
            return Result.fail<Bundle>(error, 500, error.message);
        }
    }

    async findBundleById(id: string): Promise<Result<Bundle>> {
        const bundle = await this.findOneBy({ id });

        if (bundle) {
            console.log("Combo encontrado: ", bundle);
            return Result.success<Bundle>(
                await this.ormBundleMapper.fromPersistenceToDomain(bundle),
                202
            );
        }

        return Result.fail(
            new Error(`Bundle with id ${id} not found`),
            404,
            `Bundle with id ${id} not found`
        );
    }

    findBundleByName(name: string): Promise<Result<Bundle>> {
        throw new Error("Bundle by name no se implementa para esta entrega.");
    }

    async deleteBundle(id: string): Promise<Result<Bundle>> {
        try {
            const bundle = await this.findOneBy({ id });

            if (!bundle) {
                return Result.fail<Bundle>(
                    new BundleNotFoundException(),
                    404,
                    'Bundle not found'
                );
            }

            await this.remove(bundle);

            const domainBundle = await this.ormBundleMapper.fromPersistenceToDomain(bundle);

            return Result.success<Bundle>(domainBundle, 200);
        } catch (error) {
            return Result.fail<Bundle>(error, 500, error.message);
        }
    }
}
