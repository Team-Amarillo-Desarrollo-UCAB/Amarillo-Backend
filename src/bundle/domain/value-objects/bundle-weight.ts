import { IValueObject } from "src/common/domain/value-object/value-object.interface";
import { Measurement } from "../enum/measurement-enum";
import { InvalidBundleWeightException } from "../exceptions/invalid-bundle-weight.exception";

export class BundleWeight implements IValueObject<BundleWeight> {
    private weight: number;
    private measurement: Measurement;

    protected constructor(weight: number, measurement: Measurement) {
        if (weight <= 0) {
            throw new InvalidBundleWeightException("El peso debe ser mayor a 0");
        }

        if (!measurement || !Object.values(Measurement).includes(measurement)) {
            throw new InvalidBundleWeightException("La unidad de medida no es válida");
        }

        this.weight = weight;
        this.measurement = measurement;
    }

    get Measurement(): Measurement {
        return this.measurement
    }

    get Weight(): number{
        return this.weight
    }

    get Value(): { weight: number; measurement: Measurement } {
        return {
            weight: this.weight,
            measurement: this.measurement
        };
    }
    

    equals(valueObject: BundleWeight): boolean {
        return (
            this.weight === valueObject.weight &&
            this.measurement === valueObject.measurement
        );
    }

    static create(weight: number, measurement: Measurement): BundleWeight {
        return new BundleWeight(weight, measurement);
    }
}
