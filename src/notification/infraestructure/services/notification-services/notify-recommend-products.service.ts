import { randomInt } from "crypto"
import { IApplicationService } from "src/common/application/application-services/application-service.interface"
import { ApplicationServiceEntryDto } from "src/common/application/application-services/DTO/application-service-entry.dto"
import { PushNotificationDto } from "src/common/application/push-sender/dto/send-notification-dto"
import { IPushSender } from "src/common/application/push-sender/push-sender.interface"
import { Result } from "src/common/domain/result-handler/Result"
import { UuidGenerator } from "src/common/infraestructure/id-generator/uuid-generator"
import { INotificationAddressRepository } from "../../interface/notification-address-repository.interface"
import { INotificationAlertRepository } from "../../interface/notification-alert-repository.interface"
import { OrmProductRepository } from "src/product/infraestructure/repositories/product-repository"

export class NotifyRecommendProductsInfraService implements IApplicationService<ApplicationServiceEntryDto, any> {
    
    private readonly notiAddressRepository: INotificationAddressRepository
    private readonly notiAlertRepository: INotificationAlertRepository
    private readonly productRepository: OrmProductRepository
    private readonly uuidGenerator: UuidGenerator
    private pushNotifier: IPushSender
    
    constructor(
        notiAddressRepository: INotificationAddressRepository,
        notiAlertRepository: INotificationAlertRepository,
        productRepository: OrmProductRepository,
        uuidGenerator: UuidGenerator,
        pushNotifier: IPushSender
    ){
        this.notiAddressRepository = notiAddressRepository
        this.notiAlertRepository = notiAlertRepository
        this.uuidGenerator = uuidGenerator
        this.productRepository = productRepository 
        this.pushNotifier = pushNotifier   
    }
    
    async execute(notifyDto: ApplicationServiceEntryDto): Promise<Result<any>> {
        const findResultTokens = await this.notiAddressRepository.findAllTokens()
        if ( !findResultTokens.isSuccess() ) return Result.fail(findResultTokens.Error, findResultTokens.StatusCode, findResultTokens.Message)

        const findResultProducts = await this.productRepository.findAllProducts(1)
        if ( !findResultProducts.isSuccess() ) return Result.fail(findResultProducts.Error, findResultProducts.StatusCode, findResultProducts.Message)

        const listTokens = findResultTokens.Value
        const listProducts = findResultProducts.Value
        var ran = randomInt(0, listProducts.length)
        const product = listProducts[ran]

        
        const pushTitle = 'PRODUCTO RECOMENDADO DEL DÍA!'
        const pushBody = `Te recomendamos este PRODUCTO: ${product.Name}`

        listTokens.forEach( async e => {
            const pushMessage:PushNotificationDto = { token: e.token, notification: { title: pushTitle, body: pushBody }}
            const result = await this.pushNotifier.sendNotificationPush( pushMessage )
            this.notiAlertRepository.saveNotificationAlert({
                alert_id: await this.uuidGenerator.generateId(), 
                user_id: e.user_id, 
                title: pushTitle, 
                body:  pushBody,
                date: new Date(), 
                user_readed: false 
            })
        })
        return Result.success('recommend product push sended', 200)
    }
   
    get name(): string { return this.constructor.name }
}
