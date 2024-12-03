import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { HistoricoPrecio } from "./historico-precio.entity";
import { UnidadMedida } from "src/product/domain/enum/UnidadMedida";
import { OrmCategory } from "src/category/infraestructure/entities/orm-category";
import { Detalle_Orden } from "src/order/infraestructure/entites/detalle_orden.entity";
import { OrmBundle } from "src/bundle/infraestructure/entities/bundle-orm.entity";

@Entity({ name: "producto" })
export class OrmProduct {

    @PrimaryColumn({ type: "uuid" })
    id: string

    @Column('varchar', { unique: true })
    name: string

    @Column('varchar')
    description: string

    @Column('enum', { enum: UnidadMedida })
    unidad_medida: UnidadMedida

    @Column('numeric')
    cantidad_medida: number

    @Column('numeric')
    cantidad_stock: number

    @Column('varchar', { nullable: true })
    image: string

    @OneToMany(() => HistoricoPrecio, (historico) => historico.producto)
    historicos: HistoricoPrecio[];

    @OneToMany(() => Detalle_Orden, (detalle) => detalle.producto)
    detalles: Detalle_Orden[];

    // Relación muchos a muchos con productos
    @ManyToMany(() => OrmCategory, (category) => category.products,{eager: true})
    @JoinTable({
        name: "category_product",
        joinColumn: {
            name: "product_id",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "category_id",
            referencedColumnName: "id"
        }
    })  // Tabla de unión
    categories: OrmCategory[];

    static create(
        id: string,
        name: string,
        description: string,
        unidad_medida: UnidadMedida,
        cantidad_medida: number,
        cantidad_stock: number,
        image: string,
        historicos?: HistoricoPrecio[]
    ): OrmProduct {
        const product = new OrmProduct()
        product.id = id
        product.name = name
        product.description = description
        product.unidad_medida = unidad_medida
        product.cantidad_medida = cantidad_medida
        product.cantidad_stock = cantidad_stock
        product.image = image
        product.historicos = historicos
        return product
    }
}