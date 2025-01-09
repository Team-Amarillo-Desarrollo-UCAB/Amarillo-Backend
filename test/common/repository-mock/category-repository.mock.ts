import { Category } from "src/category/domain/category.entity";
import { ICategoryRepository } from "src/category/domain/repositories/category-repository.interface";
import { OrmCategory } from "src/category/infraestructure/entities/orm-category";
import { Result } from "src/common/domain/result-handler/Result";

export class CategoryMockRepository implements ICategoryRepository{
    findCategoryByName(name: string): Promise<Result<Category>> {
        throw new Error("Method not implemented.");
    }
    deleteCategory(id: string): Promise<Result<Category>> {
        throw new Error("Method not implemented.");
    }

    private readonly Ormcategories: OrmCategory[] = []
    private readonly categories: Category[]=[]
    
    findAllCategories(page: number, perpage: number, name: string, discount: string): Promise<Result<Category[]>> {
        throw new Error("Method not implemented.");
    }

    async createCategory(category: Category): Promise<void> {
        this.categories.push(category);
    }

    addCategory(category: Category): Promise<Result<Category>> {
        throw new Error("Method not implemented.");
    }
    async findCategoryById(id: string): Promise<Result<Category>> {
        const category = this.categories.find(
            (category) => category.Id.Value === id,
          );
          if (category === undefined) {
            return Result.fail<Category>(
              new Error(`Category with id ${id} not found`),
              404,
              `Category with id ${id} not found`,
            );
          }
          return Result.success<Category>(category, 200);
        }
    
}