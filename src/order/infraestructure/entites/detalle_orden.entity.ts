import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { OrmOrder } from "./order.entity";
import { OrmProduct } from "src/product/infraestructure/entities/product.entity";

@Entity({ name: "Detalle_carrito" })
export class Detalle_Orden {

    @PrimaryColumn({ type: "uuid" })
    id: string

    @Column({ type: 'numeric' })
    cantidad: number;

    @Column( { type: "uuid" } )
    id_orden: string

    @Column( { type: "uuid" } )
    id_producto: string

    @ManyToOne(() => OrmOrder, (orden) => orden.detalles)
    @JoinColumn({ name: 'id_orden' })
    orden: OrmOrder; // Relación con la entidad Orden

    @ManyToOne(() => OrmProduct, { nullable: true , eager: true}) // Relación opcional con Producto
    @JoinColumn({ name: 'id_producto' })
    producto: OrmProduct;

    // TODO: Metodo para validar que solo tenga una referencia a producto o combo pero no ambos

    static create(
        id: string,
        cantidad: number,
        id_orden: string,
        id_producto: string,
        orden?: OrmOrder,
        producto?: OrmProduct
    ): Detalle_Orden {
        const detalle = new Detalle_Orden()
        detalle.id = id
        detalle.cantidad = cantidad
        detalle.id_orden = id_orden
        detalle.id_producto = id_producto
        detalle.orden = orden
        detalle.producto = producto
        return detalle
    }
}