import { ICategoryRepository } from "src/category/domain/repositories/category-repository.interface";
import { CategoryID } from "src/category/domain/value-objects/category-id";
import { Result } from "src/common/domain/result-handler/Result";

export class CategoriesExistenceService{
    constructor(private readonly categoryRepository:ICategoryRepository){
        this.categoryRepository=categoryRepository;
    }

    async categoriesExistenceCheck(categoriesID:string[]):Promise<Result<CategoryID[]>>{
        const categories:CategoryID[]=[]
        for (const c of categoriesID){
            const catID = CategoryID.create(c)
            const categoryResult = await this.categoryRepository.findCategoryById(catID.Value)

            if(!categoryResult.isSuccess()){
                return Result.fail(new Error('ERROR: La categoría no existe en la BD'),404,'Categoría no existe en BD')
            }else{
                categories.push(catID)
                return Result.success(categories,200)
            }
        }
    }
}