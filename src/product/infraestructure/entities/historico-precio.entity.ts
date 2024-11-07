import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { OrmPrdocut } from './product.entity';
import { OrmMoneda } from './moneda.entity';

@Entity()
export class HistoricoPrecio {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'date' })
    fecha_inicio: Date;

    @Column({ type: 'date' })
    fecha_fin: Date;

    @ManyToOne(() => OrmMoneda, moneda => moneda.id)
    @JoinColumn({ name: 'moneda_id' })
    moneda: OrmMoneda;

    @ManyToOne(() => OrmPrdocut, producto => producto.id)
    @JoinColumn({ name: 'producto_id' })
    producto: OrmPrdocut;

    @Column({ type: 'numeric' })
    precio: number;
}