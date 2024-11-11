import { IMapper } from 'src/common/application/mappers/mapper.interface';
import { Category } from 'src/category/domain/category.entity';
import { OrmCategory } from '../entities/orm-category';
import { CategoryID } from 'src/category/domain/value-objects/category-id';
import { CategoryName } from 'src/category/domain/value-objects/category-name';
import { CategoryImage } from '../../domain/value-objects/category-image';

export class OrmCategoryMapper implements IMapper<Category, OrmCategory> {
  // Convierte una entidad de dominio a una entidad ORM para persistencia
  async fromDomainToPersistence(domain: Category): Promise<OrmCategory> {
    const ormCategory = OrmCategory.create(
      domain.getCategoryID().Value,            
      domain.getCategoryName().Value,          
      domain.getCategoryImage().Value           
    );
    
    return ormCategory;
  }

  // Convierte una entidad ORM de persistencia a una entidad de dominio
  async fromPersistenceToDomain(persistence: OrmCategory): Promise<Category> {
    const category = Category.create(
      CategoryID.create(persistence.id),           
      CategoryName.create(persistence.categoryName), 
      CategoryImage.create(persistence.icon)          
    );
    
    return category;
  }
}
