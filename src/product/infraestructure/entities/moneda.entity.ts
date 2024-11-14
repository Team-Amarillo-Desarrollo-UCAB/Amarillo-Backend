import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { HistoricoPrecio } from './historico-precio.entity';

@Entity()
export class OrmMoneda {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  simbolo: string;

  @OneToMany(() => HistoricoPrecio, (historico) => historico.moneda)
  historicos: HistoricoPrecio[];

  static create(
    id: string,
    nombre: string,
    simbolo: string
): OrmMoneda {
    const moneda = new OrmMoneda()
    moneda.id = id
    moneda.simbolo = simbolo
    return moneda
}

}
