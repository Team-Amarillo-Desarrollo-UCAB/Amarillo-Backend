import { DataSource, Repository } from "typeorm";
import { OrmBundle } from "../entities/bundle-orm.entity";
import { IBundleRepository } from "src/bundle/domain/repositories/bundle-repository.interface";
import { Bundle } from "src/bundle/domain/bundle.entity";
import { Result } from "src/common/domain/result-handler/Result";
import { IMapper } from "src/common/application/mappers/mapper.interface";

export class OrmBundleRepository extends Repository<OrmBundle> implements IBundleRepository{

    private readonly ormBundleMapper: IMapper<Bundle,OrmBundle>;


    constructor(ormBundleMapper: IMapper<Bundle,OrmBundle>, dataSource: DataSource) {
        super(OrmBundle, dataSource.createEntityManager());
        this.ormBundleMapper = ormBundleMapper;
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
        // // Validación para asegurar que page y perpage son números válidos
        // page = Number(page) || 1; // Si no es número, se asigna 1
        // limit = Number(limit) || 10; // Si no es número, se asigna 10
    
        if (page < 1) {
            page = 1; // Forzar valores mínimos
        }

        console.log("Page:",page)
        console.log("Limit:",limit)
    
        const offset = (page - 1) * limit; // Calcular offset para paginación
        console.log('Offset calculado:', offset);
    
        const queryBuilder = this.createQueryBuilder('bundle');
    
        console.log("Antes del if de categoryy")
        console.log("La category antes de entrar a if category:",category)
        // Filtrar por categoría
        if (category && category.length > 0) {
            console.log('Filtrando por categorías:', category);
            queryBuilder.andWhere(
                `bundle.categories::jsonb @> :categories`, 
                { categories: category },
            );
        }
    
        // Filtrar por nombre
        if (name) {
            console.log('Filtrando por nombre del bundle:', name);
            queryBuilder.andWhere('LOWER(bundle.name) LIKE LOWER(:name)', { name: `%${name}%` });
        }
    
        // Filtrar por precio
        if (price) {
            console.log('Filtrando por precio:', price);
            queryBuilder.andWhere('bundle.price = :price', { price });
        }
    
        // Filtrar por popularidad
        if (popular) {
            console.log('Filtrando por popularidad:', popular);
            queryBuilder.andWhere('bundle.popular = :popular', { popular });
        }
    
        // Filtrar por descuento
        if (discount) {
            console.log('Filtrando por descuento:', discount);
            queryBuilder.andWhere('bundle.discount = :discount', { discount });
        }
    
        // Paginación
        queryBuilder.skip(offset).take(limit); // Usar offset y perpage
    
        try {
            const bundles = await queryBuilder.getMany(); // Ejecutar consulta
    
            if (!bundles || bundles.length === 0) {
                return Result.fail<Bundle[]>(
                    new Error('No se encontraron bundles con los criterios proporcionados'),
                    404,
                    'No se encontraron bundles'
                );
            }
    
            const domainBundles = await Promise.all(
                bundles.map((bundle) => this.ormBundleMapper.fromPersistenceToDomain(bundle))
            );
    
            return Result.success<Bundle[]>(domainBundles, 200);
        } catch (error) {
            console.error('Error en findAllBundles:', error); // Log de error para depuración
            return Result.fail<Bundle[]>(
                new Error('Error al buscar bundles'),
                500,
                'Error interno del servidor'
            );
        }
    }
    
    
    
    async addBundle(bundle: Bundle): Promise<Result<Bundle>> {
        try {
            // Convierte la entidad de dominio a una entidad persistente
            const ormBundle = await this.ormBundleMapper.fromDomainToPersistence(bundle);
            console.log('ORM Bundle:', ormBundle);
            console.log("Antes del this.save de bundle");
    
            // Guarda la entidad persistente en la base de datos
            const result = await this.save(ormBundle);
            console.log("Después del this.save de bundñe");
    
            // Convierte la entidad persistente guardada de nuevo a una entidad de dominio
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
        // Busca bundle por ID
        const bundle = await this.findOneBy({ id });
    
        if (bundle) {
            // Convierte la entidad persistente encontrada a una entidad de dominio
            return Result.success<Bundle>(
                await this.ormBundleMapper.fromPersistenceToDomain(bundle),
                202
            );
        }
    
        // Maneja el caso de bundle no encontrado
        return Result.fail(
            new Error(`Bundle with id ${id} not found`),
            404,
            `Bundle with id ${id} not found`
        );
    }
    
    findBundleByName(name: string): Promise<Result<Bundle>> {
        throw new Error("Bundle by name no se implementa para esta entrega.");
    }
    deleteBundle(id: string): Promise<Result<Bundle>> {
        throw new Error("Method not implemented.");
    }
    
}
