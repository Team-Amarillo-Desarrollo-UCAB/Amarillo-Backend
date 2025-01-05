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
import { OrderReport } from "src/order/domain/entites/order-report";
import { OrmReport } from "../entites/order-report.entity";

export class OrderRepository extends Repository<OrmOrder> implements IOrderRepository {

    private readonly ormOrderMapper: IMapper<Order, OrmOrder>
    private readonly paymentMapper: IMapper<OrderPayment, Payment>
    private readonly reportMapper: IMapper<OrderReport, OrmReport>

    private readonly ormDetalle_ordenRepository: Repository<Detalle_Orden>
    private readonly ormEstadoOrdenRepository: Repository<Estado_Orden>
    private readonly ormEstadoRepository: Repository<Estado>
    private readonly paymentRepository: Repository<Payment>
    private readonly reportRepository: Repository<OrmReport>

    constructor(
        ormOrderMapper: IMapper<Order, OrmOrder>,
        paymentMapper: IMapper<OrderPayment, Payment>,
        reportMapper: IMapper<OrderReport, OrmReport>,
        dataSource: DataSource
    ) {
        super(OrmOrder, dataSource.createEntityManager());
        this.ormOrderMapper = ormOrderMapper
        this.paymentMapper = paymentMapper
        this.reportMapper = reportMapper

        this.ormDetalle_ordenRepository = dataSource.getRepository(Detalle_Orden)
        this.ormEstadoOrdenRepository = dataSource.getRepository(Estado_Orden)
        this.ormEstadoRepository = dataSource.getRepository(Estado)
        this.paymentRepository = dataSource.getRepository(Payment)
        this.reportRepository = dataSource.getRepository(OrmReport)
    }

    async saveOrderAggregate(order: Order): Promise<Result<Order>> {

        try {
            const orden = await this.ormOrderMapper.fromDomainToPersistence(order)

            console.log("Orden para salvar: ", orden)

            const salvada = await this.save(orden)

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

    async saveReport(order: Order, reporte: OrderReport): Promise<Result<OrderReport>> {

        try {
            const orden = await this.ormOrderMapper.fromDomainToPersistence(order)
            const report = await this.reportMapper.fromDomainToPersistence(reporte)

            orden.id_reporte = report.id
            orden.reporte = report

            // Busqueda de los detalles de la orden
            const detalles = await this.ormDetalle_ordenRepository.find({
                where: {
                    id_orden: orden.id
                }
            })

            // Busqueda de los estados de la orden
            /*const estados = await this.ormEstadoOrdenRepository.find({
                where: {
                    id_orden: orden.id
                }
            })*/

            // Verifica que cada estado tenga asignado un id_orden antes de guardarlo
            /*estados.forEach(async (estado) => {
                await this.ormEstadoOrdenRepository.save(estado);
            });*/

            orden.detalles = detalles
            //orden.estados = estados

            //throw new Error('')

            // Guardar la orden (que también guardará el reporte debido a cascade: true)
            const savedOrder = await this.save(orden);  // Guardamos la orden, no el reporte directamente

            return Result.success<OrderReport>(reporte, 200)

        } catch (error) {
            return Result.fail<OrderReport>(new Error(error.message), 500, error.message)
        }

    }

    async changeOrderState(order: Order): Promise<Result<Order>> {

        try {

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
                    id_orden: order.Id.Id,
                    fecha_fin: null
                }
            })

            estado_actual.fecha_fin = new Date()

            await this.ormEstadoOrdenRepository.save(estado_actual);
            await this.ormEstadoOrdenRepository.save(estado_orden);


            return Result.success<Order>(order, 200)
        } catch (error) {
            return Result.fail<Order>(new Error(error.message), 500, error.message)
        }
    }

    async findOrderById(id: string): Promise<Result<Order>> {
        const order = await this.findOne({
            where: { id: id },
            relations: ['detalles', 'pago', 'estados', 'reporte']
        });

        console.log("Orden encontrada por Id: ", order)

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
                .leftJoinAndSelect('orden.pago', 'pago')
                .leftJoinAndSelect('orden.reporte', 'reporte')
                .leftJoinAndSelect('orden.detalles', 'detalle') // Relación con detalles
                .leftJoinAndSelect('detalle.producto', 'producto') // Relación con Producto
                .leftJoinAndSelect('detalle.combos', 'combos') // Relación con Combo (si la tienes)
                .leftJoinAndSelect('orden.estados', 'estados')   // Relación con estados
                .leftJoinAndSelect('estados.estado', 'estado')  // Relación con la entidad Estado
                .where('orden.id_user = :id_user', { id_user: id_user.Id }) // Filtrar por usuario
                .andWhere('estado.nombre IN (:...states)', { states: [EnumOrderEstados.ENTREGADA, EnumOrderEstados.CANCELED] }) // Estados permitidos
                .andWhere('estados.fecha_fin IS NULL') // Condición para asegurarse de que fecha_fin sea NULL
                .orderBy('orden.fecha_creacion', 'DESC') // Ordenar por fecha de creación

            const find_ordenes = await queryBuilder.getMany();

            console.log("Ordenes encontradas: ", find_ordenes)

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
                .leftJoinAndSelect('orden.pago', 'pago') // Relación con pago
                .leftJoinAndSelect('orden.reporte', 'reporte')
                .leftJoinAndSelect('orden.detalles', 'detalle') // Relación con detalles
                .leftJoinAndSelect('detalle.producto', 'producto') // Relación con Producto
                .leftJoinAndSelect('detalle.combos', 'combos') // Relación con Combo (si la tienes)
                .leftJoinAndSelect('orden.estados', 'estados')   // Relación con estados
                .leftJoinAndSelect('estados.estado', 'estado')  // Relación con la entidad Estado
                .where('orden.id_user = :id_user', { id_user: id_user.Id }) // Filtrar por usuario
                .andWhere('estado.nombre NOT IN (:...states)', { states: [EnumOrderEstados.ENTREGADA, EnumOrderEstados.CANCELED] }) // Estados permitidos
                .andWhere('estados.fecha_fin IS NULL') // Condición para asegurarse de que fecha_fin sea NULL
                .orderBy('orden.fecha_creacion', 'DESC') // Ordenar por fecha de creación

            const find_ordenes = await queryBuilder.getMany();

            console.log("Ordenes encontradas: ", find_ordenes)

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