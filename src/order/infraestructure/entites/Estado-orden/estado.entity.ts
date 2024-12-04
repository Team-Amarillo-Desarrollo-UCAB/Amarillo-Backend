import { Entity, Column, OneToMany, PrimaryColumn } from 'typeorm';
import { Estado_Orden } from './estado_orden.entity';
import { EnumOrderEstados } from 'src/order/domain/enum/order-estados-enum';

@Entity({ name: "Estado" })
export class Estado {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: EnumOrderEstados })
  nombre: EnumOrderEstados;

  @OneToMany(() => Estado_Orden, (estado_orden) => estado_orden.estado)
  estados: Estado_Orden[]; // Relación uno a muchos con la entidad EstadoOrden

  static create(
    id: string,
    nombre: EnumOrderEstados
  ): Estado {
    const estado = new Estado();
    estado.id = id
    estado.nombre = nombre;
    return estado;
  }

}