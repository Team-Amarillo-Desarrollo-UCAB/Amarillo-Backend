import { IValueObject } from "src/common/domain/value-object/value-object.interface";
import { InvalidDiscountDescriptionException } from "../exceptions/invalid-discount-description.exception";

export class DiscountDescription implements IValueObject<DiscountDescription> {
    private readonly description: string;

    private constructor(description: string) {
        if (!description || description.trim().length === 0) {
            //excepcion de dominio pertinente
            throw new InvalidDiscountDescriptionException("La descripcion del descuento no debe estar vacia")
        }
        this.description = description;
    }

    public static create(description: string): DiscountDescription {
        return new DiscountDescription(description);
    }

    public equals(other: DiscountDescription): boolean {
        return this.description === other.description;
    }

    get Value(){ return this.description }
}
