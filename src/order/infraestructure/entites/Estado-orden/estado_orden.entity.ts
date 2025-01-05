import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { OrmOrder } from '../order.entity';
import { Estado } from './estado.entity';

@Entity({ name: "Estado_Orden" })
export class Estado_Orden {

  @PrimaryColumn({ type: "uuid", unique: false })
  id_orden: string

  @PrimaryColumn({ type: "uuid", unique: false })
  id_estado: string

  @PrimaryColumn({ type: 'timestamp', unique: false })
  fecha_inicio: Date;

  @Column({ type: 'timestamp', nullable: true })
  fecha_fin: Date

  @ManyToOne(() => OrmOrder, (orden) => orden.estados)
  @JoinColumn({ name: 'id_orden' })
  orden: OrmOrder;

  @ManyToOne(() => Estado, (estado) => estado.estados, { eager: true })
  @JoinColumn({ name: 'id_estado' })
  estado: Estado;

  static create(
    id_orden: string,
    id_estado: string,
    fecha_inicio: Date,
    fecha_fin?: Date
  ): Estado_Orden {
    const estadoOrden = new Estado_Orden()
    estadoOrden.id_orden = id_orden
    estadoOrden.id_estado = id_estado
    estadoOrden.fecha_inicio = fecha_inicio
    estadoOrden.fecha_fin ? fecha_fin : null
    return estadoOrden;
  }

}