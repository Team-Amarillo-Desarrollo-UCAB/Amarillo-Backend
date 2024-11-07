import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { HistoricoPrecio } from "./historico-precio.entity";

@Entity({ name: "producto" })
export class OrmPrdocut {

    @PrimaryColumn({ type: "uuid" })
    id: string

    @Column('varchar', { unique: true })
    name: string

    @Column('varchar')
    description: string

    @Column('varchar')
    unidad_medida: string

    @Column('numeric')
    cantidad_medida: number

    @Column('numeric')
    cantidad_stock: number

    @Column('date')
    fecha_vencimiento: Date

    @Column('varchar', { unique: false })
    image: string

    @OneToMany(() => HistoricoPrecio, (historico) => historico.producto)
    historicos: HistoricoPrecio[];

    static create(
        id: string,
        name: string,
        description: string,
        unidad_medida: string,
        cantidad_medida: number,
        cantidad_stock: number,
        fecha_vencimiento: Date,
        image: string,
        historicos: HistoricoPrecio[]
    ): OrmPrdocut {
        const product = new OrmPrdocut()
        product.id = id
        product.name = name
        product.description = description
        product.unidad_medida = unidad_medida
        product.cantidad_medida = cantidad_medida
        product.cantidad_stock = cantidad_stock
        product.fecha_vencimiento = fecha_vencimiento
        product.image = image
        product.historicos = historicos
        return product
    }
}