import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { OrmProduct } from './product.entity';
import { OrmMoneda } from './moneda.entity';

@Entity()
export class HistoricoPrecio {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'date' })
    fecha_inicio: Date;

    @Column({ type: 'date' , nullable: true})
    fecha_fin: Date;

    @Column({ type: 'numeric' })
    precio: number;

    @ManyToOne(() => OrmMoneda, moneda => moneda.id,{ eager: true })
    @JoinColumn({ name: 'moneda_id' })
    moneda: OrmMoneda;

    @ManyToOne(() => OrmProduct, producto => producto.id)
    @JoinColumn({ name: 'producto_id' })
    producto: OrmProduct;


    static create(
        id: string,
        fecha_inicio: Date,
        precio: number,
        moneda: OrmMoneda,
        producto: OrmProduct,
        fecha_fin?: Date
    ): HistoricoPrecio{
        const historico = new HistoricoPrecio()
        historico.id = id
        historico.fecha_inicio = fecha_inicio
        historico.fecha_fin = fecha_fin
        historico.precio = precio
        historico.moneda = moneda
        historico.producto = producto
        return historico
    }
}