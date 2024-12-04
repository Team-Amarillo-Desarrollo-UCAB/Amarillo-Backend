import { IValueObject } from "src/common/domain/value-object/value-object.interface";
import { InvalidDiscountNameException } from "../exceptions/invalid-discount-name.exception";

export class DiscountName implements IValueObject<DiscountName> {
    private readonly name: string;

    private constructor(name: string) {
        if (!name || name.trim().length === 0) {
            //excepcion de dominio pertinente
            throw new InvalidDiscountNameException("El nombre del descuento no debe estar vacío")
        }
        this.name = name;
    }

    public static create(name: string): DiscountName {
        return new DiscountName(name);
    }

    public equals(other: DiscountName): boolean {
        return this.name === other.name;
    }

    get Value(){ return this.name }
}
