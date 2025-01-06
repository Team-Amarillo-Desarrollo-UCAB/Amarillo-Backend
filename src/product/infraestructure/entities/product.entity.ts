import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { HistoricoPrecio } from "./historico-precio.entity";
import { UnidadMedida } from "src/product/domain/enum/UnidadMedida";
import { Detalle_Orden } from "src/order/infraestructure/entites/detalle_orden.entity";
import { Moneda } from "src/product/domain/enum/Monedas";

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

    @Column({type:'json', nullable: true })
    image: string[];

    @Column({
        type: "enum",
        enum: Moneda,
        nullable: true
    })
    currency?: Moneda;


    // @OneToMany(() => HistoricoPrecio, (historico) => historico.producto,{eager: true})
    // historicos: HistoricoPrecio[];

    @OneToMany(() => Detalle_Orden, (detalleCarrito) => detalleCarrito.id_producto)
    detalleCarrito: Detalle_Orden[];

    @Column('numeric', { nullable: true })
    price?: number;

    @OneToMany(() => Detalle_Orden, (detalle) => detalle.producto)
    detalles: Detalle_Orden[];

    @Column({type:'json', nullable: true })
    categories: string[];

    @Column('date', { nullable: true })
    caducityDate?: Date;

    @Column('varchar', { nullable: true })
    discount?: string;


    static create(
        id: string,
        name: string,
        description: string,
        unidad_medida: UnidadMedida,
        cantidad_medida: number,
        cantidad_stock: number,
        image?: string[],
        currency?:Moneda,
        price?:number,
        categories?: string[],
        caducityDate?: Date,
        discount?:string,
        //historicos?: HistoricoPrecio[],
    ): OrmProduct {
        const product = new OrmProduct()
        product.id = id
        product.name = name
        product.description = description
        product.unidad_medida = unidad_medida
        product.cantidad_medida = cantidad_medida
        product.cantidad_stock = cantidad_stock
        product.image = image
        product.categories = categories
        product.currency = currency
        product.price=price
        //product.historicos = historicos
        product.caducityDate = caducityDate;
        product.discount=discount;

        return product
    }
}