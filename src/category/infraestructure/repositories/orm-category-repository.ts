import { Result } from 'src/common/Domain/result-handler/Result';
import { DataSource, Repository } from 'typeorm';
import { OrmCategory } from '../entities/orm-category';
import { ICategoryRepository } from 'src/category/domain/repositories/category-repository.interface';
import { Category } from 'src/category/domain/category.entity';
import { IMapper } from 'src/common/application/mappers/mapper.interface';

export class OrmCategoryRepository extends Repository<OrmCategory> implements ICategoryRepository
{
  private readonly ormCategoryMapper: IMapper<Category,OrmCategory>;

  constructor(ormCategoryMapper: IMapper<Category,OrmCategory>, dataSource: DataSource) {
    super(OrmCategory, dataSource.createEntityManager());
    this.ormCategoryMapper = ormCategoryMapper;
  }

  async addCategory(category: Category): Promise<Result<Category>> {
    try {
      // Convierte la entidad de dominio a una entidad persistente
      const ormCategory = await this.ormCategoryMapper.fromDomainToPersistence(category);
      console.log("Antes del this.save")
      const result = await this.save(ormCategory);
      console.log("Despues del this.save")

      // Convierte la entidad persistente guardada de nuevo a entidad de dominio
       return Result.success<Category>(
         await this.ormCategoryMapper.fromPersistenceToDomain(result),
         201
       );

      //return Result.success<Category>(category,200) --> version Luigi (Está bien o mal?)
    } catch (error) {
      console.log("Ocurrió un erroooooor")
      return Result.fail<Category>(error, 500, error.message);
    }
  }

  async findAllCategories(page: number, limit: number): Promise<Result<Category[]>> {
    
      // Busca todas las categorías con paginación
      const categories = await this.find({
        skip: page,
        take: limit,
        //relations: ['categorias'],
      });

      if(!categories){
        return Result.fail<Category[]>(new Error(`Categorías no almacenadas`),404,`Categorías no almacenadas`)
      }

      // Mapea cada entidad persistente a una entidad de dominio
      const domainCategories = await Promise.all(
        categories.map(
          async (category) => {
            return await this.ormCategoryMapper.fromPersistenceToDomain(category)
          })
      );

      return Result.success<Category[]>(domainCategories, 200);
  }

  async findCategoryById(id: string): Promise<Result<Category>> {
      // Busca una categoría por ID
      const category = await this.findOneBy({ id });//luigi lo hace con findOne

      if (category) {
        // Convierte la entidad persistente encontrada a una entidad de dominio
        return Result.success<Category>(
          await this.ormCategoryMapper.fromPersistenceToDomain(category),
          202
        );
      }

      // Maneja el caso de categoría no encontrada (no entra a if anterior)
      return Result.fail(
        new Error(`Category with id ${id} not found`),
        404,
        `Category with id ${id} not found`
      );
  }

  async findCategoryByName(categoryName:string): Promise<Result<Category>>{

      // Busca una categoría por nombre
      const category = await this.findOneBy({ categoryName });//luigi lo hace con findOne

      if (category) {
        // Convierte la entidad persistente encontrada a una entidad de dominio
        return Result.success<Category>(
          await this.ormCategoryMapper.fromPersistenceToDomain(category),
          202
        );
      }

      // Maneja el caso de categoría no encontrada (no entra a if anterior)
      return Result.fail(
        new Error(`Category with name ${categoryName} not found`),
        404,
        `Category with id ${categoryName} not found`
      );

  }
}
