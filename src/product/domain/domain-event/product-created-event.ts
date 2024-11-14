import { DomainEvent } from "src/common/domain/domain-event/domain-event.interface";
import { UnidadMedida } from "../enum/UnidadMedida";

export class ProductCreated extends DomainEvent {
    protected constructor(
        public id: string,
        public name: string,
        public description: string,
        public unit: UnidadMedida,
        public cantidad_medida: number,
        public amount: number,
        public currency: string,
        public image: string,
        public stock: number
    ) {
        super();
    }

    public static create(
        id: string,
        name: string,
        description: string,
        unit: UnidadMedida,
        cantidad_medida: number,
        amount: number,
        currency: string,
        image: string,
        stock: number
    ): ProductCreated {
        return new ProductCreated(
            id,
            name,
            description,
            unit,
            cantidad_medida,
            amount,
            currency,
            image,
            stock
        );
    }
}