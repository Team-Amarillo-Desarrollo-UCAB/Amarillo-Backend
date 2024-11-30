import { DomainEvent } from "src/common/domain/domain-event/domain-event.interface";
import { BundleCaducityDate } from '../value-objects/bundle-caducityDate';
import { ProductId } from "src/product/domain/value-objects/product-id";
import { BundleImage } from "../value-objects/bundle-image";
import { CategoryID } from "src/category/domain/value-objects/category-id";
import { Measurement } from "../enum/measurement-enum";
import { BundleCurrency } from "../enum/bundle-currency-enum";

export class BundleCreated extends DomainEvent {
    protected constructor(
        public id: string,
        public name: string,
        public description: string,
        public measurement: Measurement,
        public price: number,
        public currency:BundleCurrency,
        public categories: CategoryID[],
        public weight: number,
        public images: BundleImage[],
        public stock: number,
        public products:ProductId[], 
        public bundleCaducityDate?: Date
    ) {
        super();
    }

    public static create(
        id: string,
        name: string,
        description: string,
        measurement: Measurement,
        weight: number,
        price: number,
        currency:BundleCurrency,
        categories: CategoryID[],
        images: BundleImage[],
        stock: number,
        products:ProductId[],
        bundleCaducityDate?: Date
    ): BundleCreated {
        return new BundleCreated(
            id,
            name,
            description,
            measurement,
            price,
            currency,
            categories,
            weight,
            images,
            stock,
            products,
            bundleCaducityDate
        );
    }
}
