import { AggregateRoot } from 'src/common/domain/aggregate-root/aggregate-root';
import { DomainEvent } from 'src/common/domain/domain-event/domain-event.interface';
import { CategoryID } from './value-objects/category-id';
import { CategoryName } from './value-objects/category-name';
import { CategoryImage } from './value-objects/category-image';
import { InvalidCategoryException } from './exceptions/invalid-category-exception';
import { CategoryCreated } from './events/category-created-event';

export class Category extends AggregateRoot<CategoryID> {
    private categoryName: CategoryName;
    private categoryImage: CategoryImage;

    private constructor(id: CategoryID, categoryName: CategoryName, categoryImage: CategoryImage) {
        const categoryCreated: CategoryCreated = CategoryCreated.create(id.Value, categoryName.Value, categoryImage.Value)
        super(id, categoryCreated);
        this.ensureValidState();
    }

    // Método estático para crear una instancia de Category
    public static create(id: CategoryID, categoryName: CategoryName, categoryImage: CategoryImage): Category {
        return new Category(id, categoryName, categoryImage);
    }

    protected applyEvent(event: DomainEvent): void {
        // Implementación específica del evento (solo se contempla uno)
        switch (event.eventName){
          case 'CategoryCreated':
              const categoryCreated: CategoryCreated = event as CategoryCreated
              this.categoryImage = CategoryImage.create(categoryCreated.icon)
              this.categoryName = CategoryName.create(categoryCreated.name)
      }
    }

    protected ensureValidState(): void {
      if ( !this.categoryName || !this.categoryImage)
        throw new InvalidCategoryException()
    }

    getCategoryID(): CategoryID {
        return this.Id;// Accede al ID utilizando el getter Id de Entity
      }
    
      getCategoryName(): CategoryName {
        return this.categoryName;
      }
    
      getCategoryImage(): CategoryImage {
        return this.categoryImage;
      }
}