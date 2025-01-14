import { DomainEvent } from "src/common/domain/domain-event/domain-event.interface";
import { UnidadMedida } from "../enum/UnidadMedida";

    // private readonly unit: UnidadMedida;
    // private readonly cantidad_medida: ProductCantidadMedida

export class ProductUnitModified extends DomainEvent {
    protected constructor(
        public id: string,
        public cantidad_medida: number,
        public unit: UnidadMedida
    ) {
        super();
    }

    static create(id: string, cantidad_medida: number,unit: UnidadMedida): ProductUnitModified {
        return new ProductUnitModified(id,cantidad_medida,unit);
    }
}