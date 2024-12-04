import { EnumPaymentMethod } from 'src/payment-method/domain/enum/PaymentMethod';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';

@Entity({name: "metodo-pago"})
export class OrmPaymentMethod{

    @PrimaryColumn({ type: "uuid" })
    id: string

    @Column('enum', { enum: EnumPaymentMethod })
    name: EnumPaymentMethod

    static create(
        id: string,
        name: EnumPaymentMethod
    ){
        const metodo = new OrmPaymentMethod()
        metodo.id = id
        metodo.name = name
        return metodo
    }

}