import { AuditingDto } from "src/common/application/auditing/dto/auditing.dto"
import { IAuditingRepository } from "src/common/application/auditing/repositories/auditing-repository.interface"
import { Result } from "src/common/domain/result-handler/Result"
import { Repository, DataSource } from "typeorm"
import { OrmAuditing } from "../entities/orm-auditing"



export class OrmAuditingRepository extends Repository<OrmAuditing> implements IAuditingRepository
{
    constructor (dataSource: DataSource){
        super(OrmAuditing, dataSource.createEntityManager())
    }
    async saveAuditing(auditing: AuditingDto): Promise<Result<AuditingDto>>
    {
        const ormAuditing = new OrmAuditing()
        ormAuditing.id = auditing.id
        ormAuditing.userId = auditing.userId
        ormAuditing.operation = auditing.operation
        ormAuditing.data = auditing.data
        ormAuditing.madeAt = auditing.madeAt
        ormAuditing.wasSuccessful = auditing.wasSuccessful
        ormAuditing.errorType = auditing.errorType

        try
        {
            await this.save(ormAuditing)
            return Result.success(auditing, 200)
        }
        catch (error)
        {
            return Result.fail(error, error.code, error.message)
        }
    }
}