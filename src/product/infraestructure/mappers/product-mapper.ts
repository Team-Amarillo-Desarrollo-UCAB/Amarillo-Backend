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
import { HistoricoPrecio } from "../entities/historico-precio.entity";
import { ProductCurrency } from "src/product/domain/value-objects/product-precio/product-currency";
import { ProductImage } from "src/product/domain/value-objects/product-image";
import { ProductStock } from "src/product/domain/value-objects/product-stock";
import { OrmCategoryMapper } from "src/category/infraestructure/mappers/orm-category-mapper";
import { OrmCategoryRepository } from "src/category/infraestructure/repositories/orm-category-repository";
import { OrmCategory } from "src/category/infraestructure/entities/orm-category";
import { CategoryID } from "src/category/domain/value-objects/category-id";

export class ProductMapper implements IMapper<Product, OrmProduct> {

    constructor(
        private readonly categoryMapper: OrmCategoryMapper,
        private readonly categoryRepository: OrmCategoryRepository
    ) {

    }

    async fromDomainToPersistence(domain: Product): Promise<OrmProduct> {

        let categorias: OrmCategory[] = []

        for(const categoria of domain.Categories){
            const c = await this.categoryRepository.findCategoryById(categoria.Value)
            const resultado = await this.categoryMapper.fromDomainToPersistence(c.Value)
            categorias.push(resultado)
        }

        const product = OrmProduct.create(
            domain.Id.Id,
            domain.Name,
            domain.Description,
            domain.Unit,
            domain.CantidadMedida,
            domain.Stock,
            domain.Image,
            categorias,
            null
        )

        return product
    }

    async fromPersistenceToDomain(persistence: OrmProduct): Promise<Product> {

        let precio: HistoricoPrecio

        for (const p of persistence.historicos) {
            if (p.fecha_fin === null) {
                precio = p
            }
        }

        let cateogies_id: CategoryID[] = []
        for(const categoria of persistence.categories){
            cateogies_id.push(CategoryID.create(categoria.id))
        }

        const product = Product.create(
            ProductId.create(persistence.id),
            ProductName.create(persistence.name),
            ProductDescription.create(persistence.description),
            ProductUnit.create(
                persistence.unidad_medida,
                ProductCantidadMedida.create(persistence.cantidad_medida)
            ),
            ProductPrice.create(
                precio ? ProductAmount.create(precio.precio) : ProductAmount.create(5),
                precio ? ProductCurrency.create(precio.moneda.simbolo) : ProductCurrency.create('usd')
            ),
            ProductImage.create(persistence.image),
            ProductStock.create(persistence.cantidad_stock),
            cateogies_id
        )

        return product

    }


}