import { randomInt } from "crypto"
import { IApplicationService } from "src/common/application/application-services/application-service.interface"
import { ApplicationServiceEntryDto } from "src/common/application/application-services/DTO/application-service-entry.dto"
import { PushNotificationDto } from "src/common/application/push-sender/dto/send-notification-dto"
import { IPushSender } from "src/common/application/push-sender/push-sender.interface"
import { Result } from "src/common/domain/result-handler/Result"
import { UuidGenerator } from "src/common/infraestructure/id-generator/uuid-generator"
import { INotificationAddressRepository } from "../../interface/notification-address-repository.interface"
import { INotificationAlertRepository } from "../../interface/notification-alert-repository.interface"
import { OrmBundleRepository } from "src/bundle/infraestructure/repositories/orm-bundle.repository"

export class NotifyRecommendBundlesInfraService implements IApplicationService<ApplicationServiceEntryDto, any> {
    
    private readonly notiAddressRepository: INotificationAddressRepository
    private readonly notiAlertRepository: INotificationAlertRepository
    private readonly bundleRepository: OrmBundleRepository
    private readonly uuidGenerator: UuidGenerator
    private pushNotifier: IPushSender
    
    constructor(
        notiAddressRepository: INotificationAddressRepository,
        notiAlertRepository: INotificationAlertRepository,
        bundleRepository: OrmBundleRepository,
        uuidGenerator: UuidGenerator,
        pushNotifier: IPushSender
    ){
        this.notiAddressRepository = notiAddressRepository
        this.notiAlertRepository = notiAlertRepository
        this.uuidGenerator = uuidGenerator
        this.bundleRepository = bundleRepository 
        this.pushNotifier = pushNotifier   
    }
    
    async execute(notifyDto: ApplicationServiceEntryDto): Promise<Result<any>> {
        const findResultTokens = await this.notiAddressRepository.findAllTokens()
        if ( !findResultTokens.isSuccess() ) return Result.fail(findResultTokens.Error, findResultTokens.StatusCode, findResultTokens.Message)

        const findResultBundles = await this.bundleRepository.findAllBundles();
        if ( !findResultBundles.isSuccess() ) return Result.fail(findResultBundles.Error, findResultBundles.StatusCode, findResultBundles.Message)

        const listTokens = findResultTokens.Value
        const listBundles = findResultBundles.Value
        var ran = randomInt(0, listBundles.length)
        const bundle = listBundles[ran]

        
        const pushTitle = 'COMBO RECOMENDADO DEL DÍA!'
        const pushBody = `Te recomendamos este combo: ${bundle.name.Value}`

        listTokens.forEach( async e => {
            const pushMessage:PushNotificationDto = { token: e.token, notification: { title: pushTitle, body: pushBody }}
            const result = await this.pushNotifier.sendNotificationPush( pushMessage )
            //if ( result.isSuccess() ) {
            this.notiAlertRepository.saveNotificationAlert({
                alert_id: await this.uuidGenerator.generateId(), 
                user_id: e.user_id, 
                title: pushTitle, 
                body:  pushBody,
                date: new Date(), 
                user_readed: false 
            })
        })
        return Result.success('recommend bundle push sended', 200)
    }
   
    get name(): string { return this.constructor.name }
}