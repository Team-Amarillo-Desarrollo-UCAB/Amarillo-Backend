import { Product } from "src/product/domain/product";
import { OrmProduct } from "../entities/product.entity";
import { IMapper } from "src/common/application/mappers/mapper.interface";
import { ProductId } from "src/product/domain/value-objects/product-id";
import { ProductName } from "src/product/domain/value-objects/product-name";
import { ProductDescription } from "src/product/domain/value-objects/product-description";
import { ProductUnit } from "src/product/domain/value-objects/product-unit/product-unit";
import { ProductPrice } from "src/product/domain/value-objects/product-precio/product-price";
import { ProductAmount } from "src/product/domain/value-objects/product-precio/product-amount";
import { ProductCantidadMedida } from "src/product/domain/value-objects/product-unit/product-cantidad-medida";
import { ProductCurrency } from "src/product/domain/value-objects/product-precio/product-currency";
import { ProductImage } from "src/product/domain/value-objects/product-image";
import { ProductStock } from "src/product/domain/value-objects/product-stock";
import { OrmCategoryMapper } from "src/category/infraestructure/mappers/orm-category-mapper";
import { OrmCategoryRepository } from "src/category/infraestructure/repositories/orm-category-repository";
import { CategoryID } from "src/category/domain/value-objects/category-id";
import { ProductCaducityDate } from "src/product/domain/value-objects/productCaducityDate";
import { DiscountID } from "src/discount/domain/value-objects/discount-id";

export class ProductMapper implements IMapper<Product, OrmProduct> {

    constructor(
        private readonly categoryMapper: OrmCategoryMapper,
        private readonly categoryRepository: OrmCategoryRepository
    ) {

    }

    async fromDomainToPersistence(domain: Product): Promise<OrmProduct> {

        let ormCaducityDate = null;

        if (domain.ProductCaducityDate && domain.ProductCaducityDate.Value) {
            ormCaducityDate = domain.ProductCaducityDate.Value
        }

        let ormDiscount = null;

        if (domain.Discount && domain.Discount.Value) {
            ormDiscount = domain.Discount.Value
        }

        // let categorias: OrmCategory[] = []

        // for(const categoria of domain.Categories){
        //     const c = await this.categoryRepository.findCategoryById(categoria.Value)
        //     const resultado = await this.categoryMapper.fromDomainToPersistence(c.Value)
        //     categorias.push(resultado)
        // }

        const product = OrmProduct.create(
            domain.Id.Id,
            domain.Name,
            domain.Description,
            domain.Unit,
            domain.CantidadMedida,
            domain.Stock,
            domain.Images.map((i) => i.Image),
            domain.Moneda,
            domain.Price,
            domain.Categories.map(i => i.Value),
            ormCaducityDate,
            ormDiscount,
        )

        return product
    }

    async fromPersistenceToDomain(persistence: OrmProduct): Promise<Product> {



        const bundleImages = (persistence.image ?? []).map((image) => ProductImage.create(image));


        const categories = (persistence.categories ?? []).map((id) => {
            return CategoryID.create(id);
        });




        // let precio: HistoricoPrecio | undefined = undefined;

        // if (persistence.historicos && Array.isArray(persistence.historicos)) {
        //     for (const p of persistence.historicos) {
        //         if (p.fecha_fin === null) {
        //             precio = p;
        //         }
        //     }
        // }



        const product = Product.create(
            ProductId.create(persistence.id),
            ProductName.create(persistence.name),
            ProductDescription.create(persistence.description),
            ProductUnit.create(
                persistence.unidad_medida,
                ProductCantidadMedida.create(persistence.cantidad_medida)
            ),
            bundleImages,

            ProductStock.create(persistence.cantidad_stock),
            ProductPrice.create(
                ProductAmount.create(persistence.price),
                ProductCurrency.create(persistence.currency)

            ),
            categories,
            persistence.discount ? DiscountID.create(persistence.discount) : null,
            persistence.caducityDate ? ProductCaducityDate.create(persistence.caducityDate) : null,
        );

        return product;



    }


}