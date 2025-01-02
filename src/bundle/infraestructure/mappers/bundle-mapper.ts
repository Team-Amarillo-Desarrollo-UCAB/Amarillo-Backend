import { Bundle } from "src/bundle/domain/bundle.entity";
import { OrmBundle } from "../entities/bundle-orm.entity";
import { IMapper } from "src/common/application/mappers/mapper.interface";
import { BundleID } from "src/bundle/domain/value-objects/bundle-id";
import { BundleName } from "src/bundle/domain/value-objects/bundle-name";
import { BundleDescription } from "src/bundle/domain/value-objects/bundle-description";
import { BundleImage } from "src/bundle/domain/value-objects/bundle-image";
import { BundlePrice } from "src/bundle/domain/value-objects/bundle-price";
import { BundleWeight } from "src/bundle/domain/value-objects/bundle-weight";
import { BundleCaducityDate } from "src/bundle/domain/value-objects/bundle-caducityDate";
import { CategoryID } from "src/category/domain/value-objects/category-id";
import { ProductId } from "src/product/domain/value-objects/product-id";
import { BundleStock } from "src/bundle/domain/value-objects/bundle-stock";
import { DiscountID } from "src/discount/domain/value-objects/discount-id";


export class BundleMapper implements IMapper<Bundle, OrmBundle> {
    async fromDomainToPersistence(domain: Bundle): Promise<OrmBundle> {

        let ormCaducityDate = null;

        console.log("Combo para mappear: ",domain)

        if(domain.caducityDate && domain.caducityDate.Value){
            ormCaducityDate = domain.caducityDate.Value
        }

        let ormDiscount = null;

        if(domain.Discount && domain.Discount.Value){
            ormDiscount = domain.Discount.Value
        }

        const bundle = OrmBundle.create(
            domain.Id.Value,
            domain.name.Value,
            domain.description.Value,
            domain.images.map((i) => i.Value),
            domain.price.Price,
            domain.price.Currency,
            domain.weight.Weight,
            domain.weight.Measurement,
            domain.stock.Value,
            domain.categories.map(i=>i.Value),
            domain.categories.map(i=>i.Value),
            ormCaducityDate,
            ormDiscount
        );

        return bundle;
    }

    async fromPersistenceToDomain(persistence: OrmBundle): Promise<Bundle> {
        const bundleImages = persistence.images.map((image) => BundleImage.create(image));

        const categories = persistence.categories.map((id) => {
            return CategoryID.create(id);
        });

        const products = persistence.productId.map((id) => {
            return ProductId.create(id);
        });

        const stock = BundleStock.create(persistence.stock);

        console.log("DISCOUNT EN MAPPER:",persistence.discount)
        console.log("CADUCITY DATE EN BUNDLE MAPPER:",persistence.caducityDate)

        const bundle = Bundle.create(
            BundleID.create(persistence.id),
            BundleName.create(persistence.name),
            BundleDescription.create(persistence.description),
            BundleWeight.create(persistence.weight, persistence.measurement),
            BundlePrice.create(persistence.price, persistence.currency),
            categories,
            bundleImages,
            stock,
            products,
            BundleCaducityDate.create(persistence.caducityDate) ? BundleCaducityDate.create(persistence.caducityDate) : undefined,
            persistence.discount != null ? DiscountID.create(persistence.discount) : undefined
        );

        console.log("VALOR DE BUNDLE FINAL MAPPER CON DISCOUNT:",bundle.Discount)
        console.log("VALOR DE BUNDLE FINAL MAPPER CON CADUCITYDATE:",bundle.caducityDate)


        return bundle;
    }
}
