import { IValueObject } from "src/common/domain/value-object/value-object.interface";
import { InvalidBundleDescriptionException } from "../exceptions/invalid-bundle-description.exception";

export class BundleDescription implements IValueObject<BundleDescription> {
    private readonly description: string;

    private constructor(description: string) {
        if (!description || description.trim().length === 0) {
            //excepcion de dominio pertinente
            throw new InvalidBundleDescriptionException("La descripción del combo no debe estar vacía")
        }
        this.description = description;
    }

    public static create(description: string): BundleDescription {
        return new BundleDescription(description);
    }

    public equals(other: BundleDescription): boolean {
        return this.description === other.description;
    }

    get Value(){ return this.description }
}
