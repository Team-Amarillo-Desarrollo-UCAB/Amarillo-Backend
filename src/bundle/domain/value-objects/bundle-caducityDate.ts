import { IValueObject } from "src/common/domain/value-object/value-object.interface";
import { InvalidCaducityDateException } from "../exceptions/invalid-bundle-caducity-date.exception";

export class BundleCaducityDate implements IValueObject<BundleCaducityDate> {
  private readonly caducityDate: Date;

  protected constructor(caducityDate: Date) {
    // Validar que la fecha no sea nula o indefinida
    if (!caducityDate) {
      throw new InvalidCaducityDateException("La fecha de caducidad no puede estar vacía.");
    }

    // Validar que la fecha no sea una fecha pasada
    if (caducityDate < new Date()) {
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

  // Crea una nueva instancia desde una cadena
  static fromString(dateString: string): BundleCaducityDate {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new InvalidCaducityDateException("La fecha de caducidad proporcionada no es válida.");
    }
    return new BundleCaducityDate(date);
  }
}
