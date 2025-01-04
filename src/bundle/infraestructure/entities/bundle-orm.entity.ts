import { BundleCurrency } from "src/bundle/domain/enum/bundle-currency-enum";
import { Measurement } from "src/bundle/domain/enum/measurement-enum";
import { OrmCategory } from "src/category/infraestructure/entities/orm-category";
import { Detalle_Orden } from "src/order/infraestructure/entites/detalle_orden.entity";
import { OrmProduct } from "src/product/infraestructure/entities/product.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";

@Entity({ name: "bundle" })
export class OrmBundle {

    @PrimaryColumn({ type: "uuid" })
    id: string

    @Column('varchar', { unique: true })
    name: string

    @Column('varchar')
    description: string

    @Column({type:'json'})
    images: string[];

    @Column('numeric')
    price: number;

    @Column({
        type: "enum",
        enum: BundleCurrency,
    })
    currency: BundleCurrency;

    @Column('numeric')
    weight: number;

    @Column({
        type: "enum",
        enum: Measurement,
    })
    measurement: Measurement;

    @Column('int')
    stock: number;


    @Column({type:'json'})
    categories: string[];

    @Column({type:'json'})    
    productId: string[];

    @Column('date', { nullable: true })
    caducityDate?: Date;

    @Column('varchar', { nullable: true })
    discount?: string;

    @OneToMany(() => Detalle_Orden, (detalleCarrito) => detalleCarrito.id_bundle)
    detalleCarrito: Detalle_Orden[];


    static create(
        id: string,
        name: string,
        description: string,
        images: string[],
        price: number,
        currency: BundleCurrency,
        weight: number,
        measurement: Measurement,
        stock: number,
        categories: string[],
        productId: string[],
        caducityDate?: Date,
        discount?:string
    ): OrmBundle {
        const bundle = new OrmBundle();
        bundle.id = id;
        bundle.name = name;
        bundle.description = description;
        bundle.images = images;
        bundle.price = price;
        bundle.currency = currency;
        bundle.weight = weight;
        bundle.measurement = measurement;
        bundle.stock = stock;
        bundle.categories = categories;
        bundle.productId = productId;
        bundle.caducityDate = caducityDate;
        bundle.discount=discount;
        return bundle;
    }




    
}