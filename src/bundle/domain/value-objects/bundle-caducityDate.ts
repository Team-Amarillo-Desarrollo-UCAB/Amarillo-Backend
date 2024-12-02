import { IValueObject } from "src/common/domain/value-object/value-object.interface";
import { InvalidCaducityDateException } from "../exceptions/invalid-bundle-caducity-date.exception";

export class BundleCaducityDate implements IValueObject<BundleCaducityDate> {
  private readonly caducityDate?: Date;

  protected constructor(caducityDate: Date) {


    if (caducityDate && caducityDate < new Date(new Date().toISOString().slice(0, 19))) {
      throw new InvalidCaducityDateException("La fecha de caducidad no puede ser una fecha pasada.");
  }
  

    this.caducityDate = caducityDate;
  }

  // Getter para obtener la fecha encapsulada
  get Value(): Date {
    return this.caducityDate;
  }

  // Compara dos objetos `BundleCaducityDate`
  equals(valueObject: BundleCaducityDate): boolean {
    return this.caducityDate.getTime() === valueObject.caducityDate.getTime();
  }

  // Crea una nueva instancia desde un objeto `Date`
  static create(caducityDate: Date): BundleCaducityDate {
    return new BundleCaducityDate(caducityDate);
  }
}