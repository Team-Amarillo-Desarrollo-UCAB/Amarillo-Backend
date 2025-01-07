import { OrmCategory } from "src/category/infraestructure/entities/orm-category";
import { UuidGenerator } from "src/common/infraestructure/id-generator/uuid-generator";
import { Category } from "src/category/domain/category.entity";
import { CategoryID } from "src/category/domain/value-objects/category-id";
import { CategoryName } from "src/category/domain/value-objects/category-name";
import { CategoryImage } from "src/category/domain/value-objects/category-image";

export class CategoryObjectMother{

    // private readonly ormCategory: OrmCategory

    // constructor(ormCategory: OrmCategory){
    //     this.ormCategory = ormCategory
    // }

    static async createNormalCategory(name:string){
        const idGenerator = new UuidGenerator();

        const normalCategory = Category.create(
            CategoryID.create(await idGenerator.generateId()),
            CategoryName.create(name),
            CategoryImage.create('www.example.com')
        )

        return normalCategory
    }

    async createOrmCategory(){
        return OrmCategory.create(
            'cb0e2f2c-1326-428e-9fd4-b7822ff94ab7',
            'example',
            'www.example.com'
        )
    }

}