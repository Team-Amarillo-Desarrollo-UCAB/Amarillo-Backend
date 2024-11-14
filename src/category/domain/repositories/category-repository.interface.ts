import { Result } from 'src/common/domain/result-handler/Result';
import { Category } from '../category.entity';

//esto es un puerto y habran adapters en infraestructura
export interface ICategoryRepository {
    // Método para obtener todas las categorías de la base de datos
    findAllCategories(page: number, perpage: number): Promise<Result<Category[]>>;

    // Método para agregar una nueva categoría a la base de datos
    addCategory(category: Category): Promise<Result<Category>>;

    //falta en application
    findCategoryById(id: string): Promise<Result<Category>>;

    //falta en application
    findCategoryByName(name: string): Promise<Result<Category>>
}
