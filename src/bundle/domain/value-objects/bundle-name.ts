import { IValueObject } from "src/common/domain/value-object/value-object.interface";
import { InvalidBundleNameException } from "../exceptions/invalid-bundle-name.exception";

export class BundleName implements IValueObject<BundleName> {
    private readonly name: string;

    private constructor(name: string) {
        if (!name || name.trim().length === 0) {
            //excepcion de dominio pertinente
            throw new InvalidBundleNameException("El nombre del combo no debe estar vacío")
        }
        this.name = name;
    }

    public static create(name: string): BundleName {
        return new BundleName(name);
    }

    public equals(other: BundleName): boolean {
        return this.name === other.name;
    }

    get Value(){ return this.name }
}
