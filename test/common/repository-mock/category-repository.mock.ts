import { Category } from "src/category/domain/category.entity";
import { ICategoryRepository } from "src/category/domain/repositories/category-repository.interface";
import { Result } from "src/common/domain/result-handler/Result";

export class CategoryMockRepository implements ICategoryRepository{

    private readonly categories: Category[] = []
    
    findAllCategories(page: number, perpage: number, name: string, discount: string): Promise<Result<Category[]>> {
        throw new Error("Method not implemented.");
    }

    async createCategory(category: Category): Promise<void> {
        this.categories.push(category);
    }

    addCategory(category: Category): Promise<Result<Category>> {
        throw new Error("Method not implemented.");
    }
    findCategoryById(id: string): Promise<Result<Category>> {
        throw new Error("Method not implemented.");
    }
    findCategoryByName(name: string): Promise<Result<Category>> {
        throw new Error("Method not implemented.");
    }
    deleteCategory(id: string): Promise<Result<Category>> {
        throw new Error("Method not implemented.");
    }
    
}