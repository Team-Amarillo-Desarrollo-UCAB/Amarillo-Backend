import { DomainEvent } from "src/common/domain/domain-event/domain-event.interface";
import { UnidadMedida } from "../enum/UnidadMedida";
import { CategoryID } from "src/category/domain/value-objects/category-id";

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
        public stock: number,
        public categories: CategoryID[]
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
        stock: number,
        categories: CategoryID[]
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
            stock,
            categories
        );
    }
}