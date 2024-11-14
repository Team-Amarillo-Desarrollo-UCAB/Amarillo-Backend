import { IValueObject } from 'src/common/domain/value-object/value-object.interface';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';//lo que vi del curso de FH, creo que se pudiera manejar con expresiones regulares
import { InvalidCategoryIdException } from '../exceptions/invalid-category-id-exception';

export class CategoryID implements IValueObject<CategoryID> {
    private readonly id: string;

    private constructor(id: string) {
        if (!uuidValidate(id)) {
            throw new InvalidCategoryIdException();
        }
        this.id = id;
    }

    public static create(id?: string): CategoryID {
        return new CategoryID(id ? id : uuidv4());
    }

    public equals(other: CategoryID): boolean {
        return this.id === other.id;
    }

    get Value(){ return this.id }
}
