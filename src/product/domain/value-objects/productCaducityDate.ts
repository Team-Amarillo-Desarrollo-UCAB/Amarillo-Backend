import { IValueObject } from "src/common/domain/value-object/value-object.interface";
import { InvalidProductCaducityDateException } from "../domain-exception/invalid-product-caducity-date.exception";

export class ProductCaducityDate implements IValueObject<ProductCaducityDate> {
  private readonly caducityDate?: Date;

  protected constructor(caducityDate: Date) {


    if (caducityDate && caducityDate < new Date(new Date().toISOString().slice(0, 19))) {
      throw new InvalidProductCaducityDateException("La fecha de caducidad no puede ser una fecha pasada.");
  }
  

    this.caducityDate = caducityDate;
  }

  // Getter para obtener la fecha encapsulada
  get Value(): Date {
    return this.caducityDate;
  }

  // Compara dos objetos `BundleCaducityDate`
  equals(valueObject: ProductCaducityDate): boolean {
    return this.caducityDate.getTime() === valueObject.caducityDate.getTime();
  }

  // Crea una nueva instancia desde un objeto `Date`
  static create(caducityDate: Date): ProductCaducityDate {
    return new ProductCaducityDate(caducityDate);
  }
}