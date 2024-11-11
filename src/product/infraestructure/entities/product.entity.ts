import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { HistoricoPrecio } from "./historico-precio.entity";
import { UnidadMedida } from "src/product/domain/enum/UnidadMedida";

@Entity({ name: "producto" })
export class OrmProduct {

    @PrimaryColumn({ type: "uuid" })
    id: string

    @Column('varchar', { unique: true })
    name: string

    @Column('varchar')
    description: string

    @Column( 'enum', { enum: UnidadMedida } )
    unidad_medida: UnidadMedida

    @Column('numeric')
    cantidad_medida: number

    @Column('numeric')
    cantidad_stock: number

    @Column('varchar', { nullable: true })
    image: string

    @OneToMany(() => HistoricoPrecio, (historico) => historico.producto)
    historicos: HistoricoPrecio[];

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