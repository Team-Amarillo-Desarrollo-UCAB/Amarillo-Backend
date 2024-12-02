import { IValueObject } from "src/common/domain/value-object/value-object.interface";
import { InvalidDiscountPercentageException } from "../exceptions/invalid-discount-percentage.exception";

export class DiscountPercentage implements IValueObject<DiscountPercentage> {
    private readonly percentage: number;

    private constructor(percentage: number) {
        if (percentage < 1 || percentage > 100) {
            // Excepción de dominio pertinente si el porcentaje no está entre 1 y 100
            throw new InvalidDiscountPercentageException("El porcentaje de descuento debe estar entre 1 y 100");
        }
        this.percentage = percentage;
    }

    public static create(percentage: number): DiscountPercentage {
        return new DiscountPercentage(percentage);
    }

    public equals(other: DiscountPercentage): boolean {
        return this.percentage === other.percentage;
    }

    get Value() {
        return this.percentage;
    }
}
