import { Result } from 'src/common/domain/result-handler/Result';
import { DataSource, Repository } from 'typeorm';
import { OrmCategory } from '../entities/orm-category';
import { ICategoryRepository } from 'src/category/domain/repositories/category-repository.interface';
import { Category } from 'src/category/domain/category.entity';
import { IMapper } from 'src/common/application/mappers/mapper.interface';
import { CategoryNotFoundException } from '../exceptions/category-not-found-exception';

export class OrmCategoryRepository extends Repository<OrmCategory> implements ICategoryRepository
{
  private readonly ormCategoryMapper: IMapper<Category,OrmCategory>;
  //private readonly ormCategoryMapper: OrmCategoryMapper; //otra forma valida

  constructor(ormCategoryMapper: IMapper<Category,OrmCategory>, dataSource: DataSource) {
    super(OrmCategory, dataSource.createEntityManager());
    this.ormCategoryMapper = ormCategoryMapper;
  }
  async deleteCategory(id: string): Promise<Result<Category>> {
    try {
      // Buscar la categoría por su ID
      const category = await this.findOneBy({ id });
  
      if (!category) {
        // Si no se encuentra, devolver un error indicando que no existe
        return Result.fail<Category>(
          new CategoryNotFoundException(),
          404,
          'Category not found'
        );
      }
  
      // Eliminar la categoría de la base de datos
      await this.remove(category);
  
      // Convertir la entidad eliminada a dominio
      const domainCategory = await this.ormCategoryMapper.fromPersistenceToDomain(category);
  
      // Retornar la categoría eliminada en formato de dominio
      return Result.success<Category>(domainCategory, 200);
    } catch (error) {
      // Manejo de errores inesperados
      return Result.fail<Category>(error, 500, error.message);
    }
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

  async findAllCategories(
    page: number = 1,
    limit: number = 10,
    categoryName?: string,
    discount?: string
  ): Promise<Result<Category[]>> {
    // Ajustar 'page' para evitar valores inválidos
    if (page < 1) {
      page = 1;
    }
  
    const offset = (page - 1) * limit;
  
    const queryBuilder = this.createQueryBuilder('category');
  
    // Filtramos por 'categoryName' si es proporcionado
    if (categoryName) {
      console.log('Filtrando por nombre de categoría:', categoryName);
  
      // Usamos LIKE y convertimos a minúsculas para hacer una búsqueda flexible
      queryBuilder.andWhere(
        'LOWER(category.categoryName) LIKE LOWER(:categoryName)',
        { categoryName: `%${categoryName}%` } // Agregamos % para buscar coincidencias parciales
      );
    }
  
    // Filtramos por 'discount' si es proporcionado
    if (discount) {
      console.log('Filtrando por descuento:', discount);
      queryBuilder.andWhere('category.discount = :discount', { discount });
    }
  
    // Aplicamos paginación con skip y take
    queryBuilder.skip(offset).take(limit);
  
    // Intentamos obtener las categorías
    const categories = await queryBuilder.getMany();
  
    // Si no se encuentran categorías, devolvemos un error usando Result.fail
    if (!categories || categories.length === 0) {
      return Result.fail<Category[]>(
        new Error(`No se encontraron categorías con el nombre: ${categoryName}`),
        404,
        'No se encontraron categorías'
      );
    }
  
    // Convertimos las categorías obtenidas a dominio
    const domainCategories = await Promise.all(
      categories.map((category) =>
        this.ormCategoryMapper.fromPersistenceToDomain(category)
      )
    );
  
    // Devolvemos las categorías encontradas con éxito
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
