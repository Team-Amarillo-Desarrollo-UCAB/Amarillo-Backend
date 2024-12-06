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

export class OrderRepository extends Repository<OrmOrder> implements IOrderRepository {

    private readonly ormOrderMapper: IMapper<Order, OrmOrder>

    private readonly ormDetalle_ordenRepository: Repository<Detalle_Orden>
    private readonly ormEstadoOrdenRepository: Repository<Estado_Orden>
    private readonly ormEstadoRepository: Repository<Estado>

    constructor(ormOrderMapper: IMapper<Order, OrmOrder>, dataSource: DataSource) {
        super(OrmOrder, dataSource.createEntityManager());
        this.ormOrderMapper = ormOrderMapper

        this.ormDetalle_ordenRepository = dataSource.getRepository(Detalle_Orden)
        this.ormEstadoOrdenRepository = dataSource.getRepository(Estado_Orden)
        this.ormEstadoRepository = dataSource.getRepository(Estado)
    }

    async saveOrderAggregate(order: Order): Promise<Result<Order>> {
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

            console.log("Estado orden para salvar:",estado_orden)

            await this.ormEstadoOrdenRepository.save(estado_orden)

            return Result.success<Order>(order, 200)
        } catch (error) {
            return Result.fail<Order>(new Error(error.message), error.code, error.message)

        }
    }

    async findOrderById(id: string): Promise<Result<Order>> {
        const order = await this.findOne({
            where: { id: id }
        });

        if (!order)
            return Result.fail<Order>(new Error(`Orden con id ${id} no encontrado`), 404, `Orden con id ${id} no encontrado`)


        const resultado = await this.ormOrderMapper.fromPersistenceToDomain(order)

        console.log("orden mappeada")
        return Result.success(resultado, 202)
    }

    findAllOrdersByUser(page: number, limit: number, id_user: string): Promise<Result<Order[]>> {
        throw new Error("Method not implemented.");
    }

    async findAllOrders(page: number, limit: number): Promise<Result<Order[]>> {
        const ordenes = await this.find({
            skip: page,
            take: limit,
            relations: ['historicos'],
        })

        if (!ordenes)
            return Result.fail<Order[]>(new Error(`Ordenes no almacenadas`), 404, `Ordenes no almacenadas`)

        const resultado = await Promise.all(
            ordenes.map(async (orden) => {
                return await this.ormOrderMapper.fromPersistenceToDomain(orden); // Retorna el Product
            })
        );

        return Result.success<Order[]>(resultado, 202)
    }

}