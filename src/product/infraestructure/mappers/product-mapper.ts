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

export class ProductMapper implements IMapper<Product,OrmProduct>{
    
    
    async fromDomainToPersistence(domain: Product): Promise<OrmProduct> {
        const product = OrmProduct.create(
            domain.Id.Id,
            domain.Name,
            domain.Description,
            domain.Unit,
            domain.CantidadMedida,
            domain.Stock,
            domain.Image,
        )

        return product
    }

    async fromPersistenceToDomain(persistence: OrmProduct): Promise<Product> {
        
        let precio: HistoricoPrecio

        for(const p of persistence.historicos){
            if(p.fecha_fin === null){
                precio = p
            }
        }
        
        console.log(precio)

        const product = Product.create(
            ProductId.create(persistence.id),
            ProductName.create(persistence.name),
            ProductDescription.create(persistence.description),
            ProductUnit.create(
                persistence.unidad_medida,
                ProductCantidadMedida.create(persistence.cantidad_medida)
            ),
            ProductPrice.create(
                ProductAmount.create(precio.precio),
                ProductCurrency.create(precio.moneda.simbolo)
            ),
            ProductImage.create(persistence.image),
            ProductStock.create(persistence.cantidad_stock)
        )

        return product
        
    }
 

}