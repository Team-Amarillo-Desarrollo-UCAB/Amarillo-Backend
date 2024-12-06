import { Entity } from "src/common/domain/entity/entity";
import { ProductId } from "src/product/domain/value-objects/product-id";
import { OrderProductName } from "../value-object/order-product/order-product-name";
import { OrderProductCantidad } from "../value-object/order-product/order-product-cantidad";
import { OrderProductPrice } from "../value-object/order-product/order-product-price";

export class OrderProduct extends Entity<ProductId> {

    protected constructor(
        id: ProductId,
        private readonly name: OrderProductName,
        private readonly cantidad: OrderProductCantidad,
        private readonly precio: OrderProductPrice
    ) {
        super(id)
    }

    Name(){
        return this.name
    }

    Cantidad(){
        return this.cantidad
    }

    Moneda(){
        return this.precio.Currency
    }

    Precio(){
        return this.precio
    }

    static create(
        id: ProductId,
        name: OrderProductName,
        cantidad: OrderProductCantidad,
        precio: OrderProductPrice
    ) {
        return new OrderProduct(id,name,cantidad,precio)
    }

}