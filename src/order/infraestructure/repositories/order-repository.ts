import { IMapper } from "src/common/application/mappers/mapper.interface";
import { Result } from "src/common/domain/result-handler/Result";
import { Order } from "src/order/domain/order";
import { IOrderRepository } from "src/order/domain/repositories/order-repository.interface";
import { OrmOrder } from "../entites/order.entity";
import { DataSource, Repository } from "typeorm";

export class OrderRepository extends Repository<OrmOrder> implements IOrderRepository{

    private readonly ormOrderMapper: IMapper<Order, OrmOrder>

    constructor(ormOrderMapper: IMapper<Order, OrmOrder>,dataSource: DataSource ) {
        super(OrmOrder, dataSource.createEntityManager());
        this.ormOrderMapper = ormOrderMapper
    }

    async saveOrderAggregate(order: Order): Promise<Result<Order>> {
        try
        {
            const orden = await this.ormOrderMapper.fromDomainToPersistence(order)
            console.log("orden: ",orden)
            const resultado = await this.save(orden)
            return Result.success<Order>( order, 200 )
        } catch ( error )
        {
            return Result.fail<Order>( new Error( error.message ), error.code, error.message )

        }
    }
    
    async findOrderById(id: string): Promise<Result<Order>> {
        const order = await this.findOne({
            where: { id: id }
        });

        if (!order)
            return Result.fail<Order>(new Error(`Orden con id ${id} no encontrado`), 404, `Orden con id ${id} no encontrado`)

        console.log("orden por id: ",order)

        const resultado = await this.ormOrderMapper.fromPersistenceToDomain(order)

        return Result.success(resultado, 202)
    }

    findAllOrdersByUser(page: number, limit: number, id_user: string): Promise<Result<Order[]>> {
        throw new Error("Method not implemented.");
    }

}