/* eslint-disable @typescript-eslint/no-unused-vars */
import { IMapper } from "src/common/application/mappers/mapper.interface";
import { Result } from "src/common/domain/result-handler/Result";
import { Order } from "src/order/domain/order";
import { IOrderRepository } from "src/order/domain/repositories/order-repository.interface";
import { OrmOrder } from "../entites/order.entity";
import { DataSource, getRepository, Repository } from "typeorm";
import { Detalle_Orden } from "../entites/detalle_orden.entity";
import { Estado_Orden } from "../entites/Estado-orden/estado_orden.entity";
import { Estado } from "../entites/Estado-orden/estado.entity";
import { OrderPayment } from "src/order/domain/entites/order-payment";
import { Payment } from "../entites/payment.entity";
import { UserId } from "src/user/domain/value-object/user-id";
import { EnumOrderEstados } from "src/order/domain/enum/order-estados-enum";

export class OrderRepository extends Repository<OrmOrder> implements IOrderRepository {

    private readonly ormOrderMapper: IMapper<Order, OrmOrder>
    private readonly paymentMapper: IMapper<OrderPayment, Payment>

    private readonly ormDetalle_ordenRepository: Repository<Detalle_Orden>
    private readonly ormEstadoOrdenRepository: Repository<Estado_Orden>
    private readonly ormEstadoRepository: Repository<Estado>
    private readonly paymentRepository: Repository<Payment>

    constructor(
        ormOrderMapper: IMapper<Order, OrmOrder>,
        paymentMapper: IMapper<OrderPayment, Payment>,
        dataSource: DataSource
    ) {
        super(OrmOrder, dataSource.createEntityManager());
        this.ormOrderMapper = ormOrderMapper
        this.paymentMapper = paymentMapper

        this.ormDetalle_ordenRepository = dataSource.getRepository(Detalle_Orden)
        this.ormEstadoOrdenRepository = dataSource.getRepository(Estado_Orden)
        this.ormEstadoRepository = dataSource.getRepository(Estado)
        this.paymentRepository = dataSource.getRepository(Payment)
    }

    async saveOrderAggregate(order: Order): Promise<Result<Order>> {

        try {
            const orden = await this.ormOrderMapper.fromDomainToPersistence(order)

            const payment = await this.paymentMapper.fromDomainToPersistence(order.Payment)

            await this.paymentRepository.save(payment);

            console.log("Hasta aqui sigue todo bien")

            orden.pago = payment

            const salvada = await this.save(orden)

            console.log("Orden salvada: ",salvada)

            const estado = await this.ormEstadoRepository.findOne({
                where: { nombre: order.Estado.Estado }
            });

            const estado_orden = Estado_Orden.create(
                order.Id.Id,
                estado.id,
                order.Fecha_creacion.Date_creation,
                null
            )

            await this.ormEstadoOrdenRepository.save(estado_orden)

            return Result.success<Order>(order, 200)
        } catch (error) {
            console.log(error.message)
            return Result.fail<Order>(new Error(error.message), error.code, error.message)
        }
    }

    async changeOrderState(order: Order): Promise<Result<Order>> {

        const queryRunner = this.ormEstadoOrdenRepository.manager.connection.createQueryRunner();
        await queryRunner.startTransaction();

        try {
            const orden = await this.ormOrderMapper.fromDomainToPersistence(order)

            await this.save(orden)

            const estado = await this.ormEstadoRepository.findOne({
                where: { nombre: order.Estado.Estado }
            });

            const estado_orden = Estado_Orden.create(
                order.Id.Id,
                estado.id,
                order.Fecha_creacion.Date_creation,
                null
            )

            const estado_actual = await this.ormEstadoOrdenRepository.findOne({
                where: {
                    id_orden: orden.id,
                    fecha_fin: null
                }
            })

            estado_actual.fecha_fin = new Date()

            await queryRunner.manager.save(estado_actual);
            await queryRunner.manager.save(estado_orden);

            await queryRunner.commitTransaction();

            return Result.success<Order>(order, 200)
        } catch (error) {
            return Result.fail<Order>(new Error(error.message), 500, error.message)
        }
    }

    async findOrderById(id: string): Promise<Result<Order>> {
        const order = await this.findOne({
            where: { id: id },
            relations: ['detalles']
        });

        if (!order)
            return Result.fail<Order>(new Error(`Orden con id ${id} no encontrado`), 404, `Orden con id ${id} no encontrado`)


        const resultado = await this.ormOrderMapper.fromPersistenceToDomain(order)

        console.log("orden mappeada")
        return Result.success(resultado, 202)
    }

    async findAllOrdersByUser(page: number, limit: number, id_user: UserId): Promise<Result<Order[]>> {

        try {
            const ordenes = await this.findBy({ id_user: id_user.Id })
            if (!ordenes)
                return Result.fail<Order[]>(new Error(`Ordenes no almacenadas`), 404, `Ordenes no almacenadas`)

            const result: Order[] = []

            for (const orden of ordenes) {

                result.push(
                    await this.ormOrderMapper.fromPersistenceToDomain(orden)
                )

            }

            return Result.success<Order[]>(result, 202)
        } catch (error) {
            return Result.fail<Order[]>(new Error(`Error al buscar las ordenes`), 500, `Error al buscar las ordenes`)
        }
    }

    async findAllPastOrdersByUser(id_user: UserId): Promise<Result<Order[]>> {

        try {
            const queryBuilder = this.createQueryBuilder('orden')
                .leftJoinAndSelect('orden.detalles', 'detalles') // Relación con detalles
                .leftJoinAndSelect('orden.estados', 'estados')   // Relación con estados
                .leftJoinAndSelect('estados.estado', 'estado')  // Relación con la entidad Estado
                .where('orden.id_user = :id_user', { id_user: id_user.Id }) // Filtrar por usuario
                .andWhere('estado.nombre IN (:...states)', { states: [EnumOrderEstados.ENTREGADA, EnumOrderEstados.CANCELED] }) // Estados permitidos
                .orderBy('orden.fecha_creacion', 'DESC') // Ordenar por fecha de creación

            const find_ordenes = await queryBuilder.getMany();

            const ordenes: Order[] = []

            for (const orden of find_ordenes) {

                ordenes.push(
                    await this.ormOrderMapper.fromPersistenceToDomain(orden)
                )

            }

            return Result.success<Order[]>(ordenes, 200);

        } catch (error) {
            return Result.fail<Order[]>(new Error(error.message), 500, error.message)
        }

    }

    async findAllActiveOrdersByUser(id_user: UserId): Promise<Result<Order[]>> {
        try {
            const queryBuilder = this.createQueryBuilder('orden')
                .leftJoinAndSelect('orden.detalles', 'detalle') // Relación con detalles
                .leftJoinAndSelect('detalle.producto', 'producto') // Relación con Producto
                .leftJoinAndSelect('producto.historicos', 'historicos')
                .leftJoinAndSelect('historicos.moneda', 'moneda')
                .leftJoinAndSelect('detalle.combos', 'combos') // Relación con Combo (si la tienes)
                .leftJoinAndSelect('orden.estados', 'estados')   // Relación con estados
                .leftJoinAndSelect('estados.estado', 'estado')  // Relación con la entidad Estado
                .where('orden.id_user = :id_user', { id_user: id_user.Id }) // Filtrar por usuario
                .andWhere('estado.nombre NOT IN (:...states)', { states: [EnumOrderEstados.ENTREGADA, EnumOrderEstados.CANCELED] }) // Estados permitidos
                .orderBy('orden.fecha_creacion', 'DESC') // Ordenar por fecha de creación

            const find_ordenes = await queryBuilder.getMany();

            console.log("Ordenes encontradas: ",find_ordenes)

            const ordenes: Order[] = []

            for (const orden of find_ordenes) {

                ordenes.push(
                    await this.ormOrderMapper.fromPersistenceToDomain(orden)
                )

            }

            return Result.success<Order[]>(ordenes, 200);

        } catch (error) {
            return Result.fail<Order[]>(new Error(error.message), 500, error.message)
        }
    }


    async findAllOrders(page: number, limit: number): Promise<Result<Order[]>> {
        const ordenes = await this.find({
            skip: page,
            take: limit,
            relations: ['detalles']
        })

        if (!ordenes)
            return Result.fail<Order[]>(new Error(`Ordenes no almacenadas`), 404, `Ordenes no almacenadas`)

        const result: Order[] = []

        for (const orden of ordenes) {

            result.push(
                await this.ormOrderMapper.fromPersistenceToDomain(orden)
            )

        }

        return Result.success<Order[]>(result, 202)
    }

}