import { DomainEvent } from "src/common/domain/domain-event/domain-event.interface";
import { UnidadMedida } from "../enum/UnidadMedida";
import { CategoryID } from "src/category/domain/value-objects/category-id";
import { DiscountID } from "src/discount/domain/value-objects/discount-id";
import { ProductCaducityDate } from "../value-objects/productCaducityDate";
import { ProductImage } from "../value-objects/product-image";
import { ProductWeight } from "../value-objects/product-weight";

export class ProductCreated extends DomainEvent {
    protected constructor(
        public id: string,
        public name: string,
        public description: string,
        public unit: UnidadMedida,
        public cantidad_medida: number,
        public amount: number,
        public currency: string,
        public images: ProductImage[],
        public stock: number,
        public categories: CategoryID[],
        public discount?: DiscountID,
        public caducityDate?: ProductCaducityDate,
        public weight?: ProductWeight
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
        images: ProductImage[],
        stock: number,
        categories: CategoryID[],
        discount?: DiscountID,
        caducityDate?: ProductCaducityDate,
        weight?: ProductWeight 
    ): ProductCreated {
        return new ProductCreated(
            id,
            name,
            description,
            unit,
            cantidad_medida,
            amount,
            currency,
            images,
            stock,
            categories,
            discount,
            caducityDate,
            weight
        );
    }
}