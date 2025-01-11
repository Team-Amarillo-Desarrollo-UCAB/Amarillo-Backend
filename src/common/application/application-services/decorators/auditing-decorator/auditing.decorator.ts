import { Result } from "src/common/domain/result-handler/Result"
import { IApplicationService } from "../../application-service.interface"
import { ApplicationServiceDecorator } from "../application-service.decorator"
import { ApplicationServiceEntryDto } from "../../DTO/application-service-entry.dto"
import { IdGenerator } from "../../../id-generator/id-generator.interface"
import { AuditingDto } from "../../../auditing/dto/auditing.dto"
import { IAuditingRepository } from "../../../auditing/repositories/auditing-repository.interface"



export class AuditingDecorator<D extends ApplicationServiceEntryDto, R> extends ApplicationServiceDecorator<D, R> implements IApplicationService<D, R>
{

    private readonly idGenerator: IdGenerator<string>
    private readonly auditingRepository: IAuditingRepository

    constructor ( applicationService: IApplicationService<D, R>, auditingRepository: IAuditingRepository, idGenerator: IdGenerator<string> )
    {
        super( applicationService )
        this.idGenerator = idGenerator
        this.auditingRepository = auditingRepository

    }

    async execute ( data: D ): Promise<Result<R>>
    {
        const result = await super.execute( data )
        let errorT = ''
        if(!result.isSuccess()) errorT = JSON.stringify(result.Error.message)
        const toAudith: AuditingDto = {
            id: await this.idGenerator.generateId(),
            userId: data.userId,
            data: JSON.stringify( data ),
            operation: this.applicationService.name,
            madeAt: new Date(),
            wasSuccessful: result.isSuccess(),
            errorType : errorT
        } 
        await this.auditingRepository.saveAuditing( toAudith )
        return result
    }

}