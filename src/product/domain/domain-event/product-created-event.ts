import { DomainEvent } from "src/common/domain/domain-event/domain-event.interface";
import { UnidadMedida } from "../enum/UnidadMedida";
import { CategoryID } from "src/category/domain/value-objects/category-id";
import { DiscountID } from "src/discount/domain/value-objects/discount-id";
import { ProductCaducityDate } from "../value-objects/productCaducityDate";
import { ProductImage } from "../value-objects/product-image";
import { ProductWeight } from "../value-objects/product-weight";
import { Moneda } from 'src/product/domain/enum/Monedas';
import { Product3DImage } from "../value-objects/product-3d-image";

export class ProductCreated extends DomainEvent {
    protected constructor(
        public id: string,
        public name: string,
        public description: string,
        public unit: UnidadMedida,
        public cantidad_medida: number,
        public amount: number,
        public currency: Moneda,
        public images: ProductImage[],
        public stock: number,
        public categories: CategoryID[],
        public discount?: DiscountID,
        public caducityDate?: ProductCaducityDate,
        public image3d?: Product3DImage
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
        currency: Moneda,
        images: ProductImage[],
        stock: number,
        categories: CategoryID[],
        discount?: DiscountID,
        caducityDate?: ProductCaducityDate,
        image3d?: Product3DImage
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
            image3d
        );
    }
}