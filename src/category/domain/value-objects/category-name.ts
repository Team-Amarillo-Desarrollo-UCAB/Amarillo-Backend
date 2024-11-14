import { IValueObject } from "src/common/domain/value-object/value-object.interface";

export class CategoryName implements IValueObject<CategoryName> {
    private readonly name: string;

    private constructor(name: string) {
        if (!name || name.trim().length === 0) {
            throw new Error("El nombre de la categoría no puede estar vacío.");
        }
        this.name = name;
    }

    public static create(name: string): CategoryName {
        return new CategoryName(name);
    }

    public equals(other: CategoryName): boolean {
        return this.name === other.name;
    }

    get Value(){ return this.name }
}
