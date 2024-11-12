import { IValueObject } from "src/common/Domain/value-object/value-object.interface";
import { InvalidCategoryIconException } from "../exceptions/invalid-category-icon-exception";

export class CategoryImage implements IValueObject<CategoryImage> {
    private readonly url: string;

    private constructor(url: string) {
        if (!url) {
            throw new InvalidCategoryIconException();
        }
        this.url = url;
    }

    public static create(url: string): CategoryImage {
        return new CategoryImage(url);
    }

    public equals(other: CategoryImage): boolean {
        return this.url === other.url;
    }

    get Value(){ return this.url }

    private isValidURL(url: string): boolean {
        const urlPattern = new RegExp(  
            '^(https?:\\/\\/)?' + // protocolo  
            '((([a-zA-Z0-9$-_.+!*\'(),]|[^\\x00-\\x1F\\x20-\\x7E])+)(\\.[a-zA-Z0-9-]+)+)' + // dominio y subdominios  
            '(\\:[0-9]{1,5})?' + // puerto  
            '(\\/.*)?$', 'u'  
        );  
        return urlPattern.test(url);
    }
}
